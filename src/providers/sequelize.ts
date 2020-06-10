import { dependencies } from 'dag-maker';
import { forward } from 'forwardit';
import fs from 'fs';
import path from 'path';
import { Transaction } from 'sequelize';
import { Sequelize, Model, ModelCtor } from 'sequelize-typescript';
import sqlFormatter from 'sql-formatter';
import { ConfigProvider } from './config';
import { LoggerProvider } from './logger';
import { Logger } from '../libraries';

type TransactionalCallback<R> = (transaction: Transaction) => Promise<R>;

declare module './utils' {
  interface Forwards extends Pick<SequelizeProvider, 'sequelize' | 'transactional'> {}
}

@dependencies({
  configProvider: ConfigProvider,
  loggerProvider: LoggerProvider,
})
export class SequelizeProvider {
  @forward
  readonly sequelize: Sequelize;

  readonly logger: Logger;

  constructor(logger: Logger, sequelize: Sequelize) {
    this.logger = logger;
    this.sequelize = sequelize;
  }

  @forward
  async transactional<R>(callback: TransactionalCallback<R>) {
    const transaction = await this.sequelize.transaction();
    try {
      const result = await callback(transaction);
      await transaction.commit();
      return result;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  static async create(options: { configProvider: ConfigProvider; loggerProvider: LoggerProvider }) {
    const config = options.configProvider.config.providers.sequelize;
    const logger = options.loggerProvider.logger;

    logger.info('Create SequelizeProvider');
    const logging = config.logging
      ? (sql: string) => {
          let msg: string;
          const matched = sql.match(/^Executing \(default\):\s+(?<body>.*)$/);
          if (matched && matched.groups) {
            msg = sqlFormatter.format(matched.groups.body);
          } else {
            msg = sql;
          }
          logger.info(`Sequelize\n${msg}`);
        }
      : false;
    const sequelize = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      dialect: config.dialect,
      logging,
    });

    // test connection
    await sequelize.authenticate();

    // load models
    const modelDir = this.getModelDir();
    const modelPaths = fs.readdirSync(modelDir);
    const modelNames: string[] = [];
    for (const modelPath of modelPaths) {
      if (
        modelPath.endsWith('.d.ts') ||
        (!modelPath.endsWith('.js') && !modelPath.endsWith('.ts'))
      ) {
        continue;
      }
      try {
        const file = path.join(modelDir, modelPath);
        const data = require(file);
        if (!data) {
          continue;
        }
        for (const key of Object.keys(data)) {
          const ctor: ModelCtor = data[key];
          if (
            ctor &&
            ctor.name &&
            ctor.prototype instanceof Model &&
            !modelNames.includes(ctor.name)
          ) {
            sequelize.addModels([ctor]);
            modelNames.push(ctor.name);
          }
        }
      } catch (err) {
        logger.warn(err);
      }
    }

    const databaseVersion = await sequelize.databaseVersion();
    logger.info(
      `SequelizeProvider database:\n%s`,
      JSON.stringify(
        {
          dialet: sequelize.getDialect(),
          version: databaseVersion,
          models: modelNames,
        },
        undefined,
        2
      )
    );

    return new SequelizeProvider(logger, sequelize);
  }

  static async destroy(sequelizeProvider: SequelizeProvider) {
    sequelizeProvider.logger.info('Destroy SequelizeProvider');
    await sequelizeProvider.sequelize.close();
  }

  static getModelDir() {
    return path.join(__dirname, '../models');
  }
}
