import fs from 'fs';
import path from 'path';
import { context } from '../context';
import { MigrationModel } from '../models';
import { matchSourceFileName, unixTime } from '../libraries';

export interface MigrationStatus {
  database: {
    name: string;
    version: string;
  };
  migrations: MigrationModel[];
}

class MigrationFileInfo {
  constructor(
    public readonly date: Date,
    public readonly name: string,
    public readonly fileType: 'js' | 'ts',
    public readonly filePath: string
  ) {}

  static fromRaw(options: { date: Date; name: string; fileType: 'js' | 'ts'; fileRoot: string }) {
    const pad = (num: number, width = 2) => {
      return num.toString(10).padStart(width, '0');
    };
    const year = options.date.getFullYear();
    const month = options.date.getMonth() + 1;
    const d = options.date.getDate();
    const h = options.date.getHours();
    const m = options.date.getMinutes();
    const s = options.date.getSeconds();
    const fileName = `${year}.${pad(month)}.${pad(d)}-${pad(h)}.${pad(m)}.${pad(s)}-${
      options.name
    }.${options.fileType}`;
    const filePath = path.join(options.fileRoot, fileName);
    return new MigrationFileInfo(options.date, options.name, options.fileType, filePath);
  }

  static fromFilePath(filePath: string) {
    const fileName = path.basename(filePath);
    const matched = /^(?<year>\d+)\.(?<month>\d{2})\.(?<d>\d{2})-(?<h>\d{2})\.(?<m>\d{2})\.(?<s>\d{2})-(?<name>.*)\.(?<type>ts|js)$/g.exec(
      fileName
    );
    if (!matched || !matched.groups) {
      return undefined;
    }
    const groups = matched.groups;
    const data = ['year', 'month', 'd', 'h', 'm', 's'].reduce((acc, key) => {
      const value = groups[key];
      const num = Number.parseInt(value, 10);
      return { ...acc, [key]: num };
    }, {}) as any;
    const date = new Date(data.year, data.month - 1, data.d, data.h, data.m, data.s);
    const name = groups.name;
    const fileType = groups.type as 'js' | 'ts';
    return new MigrationFileInfo(date, name, fileType, filePath);
  }
}

export class MigrationController {
  /**
   * Init migration model.
   */
  async init() {
    await MigrationModel.sync();
  }

  /**
   * Create migration file.
   * @param name Migration name.
   * @param template Template name.
   */
  async create(name: string, template: string) {
    const exists = await MigrationModel.exists(name);
    if (exists) {
      throw new Error(`Migration name "${name}" already exists`);
    }
    const info = MigrationFileInfo.fromRaw({
      date: new Date(),
      name,
      fileType: 'ts',
      fileRoot: this.getMigrationPath(),
    });
    const fileData = this.readMigrationTemplate(template);
    if (!fileData) {
      throw new Error(`Migration template "${template}" not found`);
    }
    fs.writeFileSync(info.filePath, fileData);
    return info;
  }

  /**
   * Sync migration file info with model.
   */
  async sync() {
    const infoItems = this.getMigrationFileInfo();
    const infoNames = new Set(infoItems.map((item) => item.name));
    const migrationItems = await MigrationModel.findAllOrderByCreatedAt('ASC');
    const migrationItemMap = new Map(migrationItems.map((item) => [item.name, item]));

    await context.transactional(async (transaction) => {
      // update missing migrations
      for (const migrationItem of migrationItems) {
        if (!infoNames.has(migrationItem.name)) {
          await migrationItem.update(
            {
              path: '',
              updatedAt: unixTime(),
            },
            { transaction }
          );
        }
      }
      // add new migrations & fix missing migrations
      for (const infoItem of infoItems) {
        const createdAt = Math.floor(infoItem.date.valueOf() / 1000);
        const migrationItem = migrationItemMap.get(infoItem.name);
        if (!migrationItem) {
          await MigrationModel.create(
            {
              name: infoItem.name,
              path: infoItem.filePath,
              status: MigrationModel.status.todo,
              createdAt,
            },
            { transaction }
          );
        } else if (
          migrationItem.path !== infoItem.filePath ||
          migrationItem.createdAt !== createdAt
        ) {
          await migrationItem.update(
            {
              path: infoItem.filePath,
              createdAt,
              updatedAt: unixTime(),
            },
            { transaction }
          );
        }
      }
    });
  }

  /**
   * Process a migration.
   * @param id Migration ID.
   * @param action Migration action.
   */
  async process(id: number, action: 'up' | 'down') {
    const migration = await MigrationModel.findOne({ where: { id } });
    if (!migration) {
      throw new Error(`Migration not found, ID: ${id}`);
    }
    if (!migration.path) {
      throw new Error(`Migration path is missing, ID: ${id}`);
    }
    const lib = require(migration.path);
    const handler = lib[action];
    await context.transactional(async (transaction) => {
      await migration.update(
        {
          status: action,
          updatedAt: unixTime(),
        },
        { transaction }
      );
      await handler(context.sequelize);
    });
  }

  getStatus() {
    return MigrationModel.findAllOrderByCreatedAt('ASC');
  }

  /**
   * Get migrations path.
   */
  getMigrationPath() {
    return path.join(__dirname, '../migrations');
  }

  /**
   * Get migrations path.
   */
  getMigrationTemplatePath() {
    return path.join(__dirname, '../migrations/templates');
  }

  /**
   * Get migration file info.
   */
  getMigrationFileInfo() {
    const rootPath = this.getMigrationPath();
    const items: MigrationFileInfo[] = [];
    const names = fs.readdirSync(rootPath);
    for (const name of names) {
      if (!matchSourceFileName(name)) {
        continue;
      }
      const filePath = path.join(rootPath, name);
      const info = MigrationFileInfo.fromFilePath(filePath);
      if (info) {
        items.push(info);
      }
    }
    return items.sort((a, b) => a.date.valueOf() - b.date.valueOf());
  }

  /**
   * Read migration template.
   * @param name Template name, without file extension.
   */
  readMigrationTemplate(name: string) {
    const rootPath = this.getMigrationTemplatePath();
    const fileNames = fs.readdirSync(rootPath);
    for (const fileName of fileNames) {
      if (!matchSourceFileName(fileName)) {
        continue;
      }
      const ext = path.extname(fileName);
      if (name + ext === fileName) {
        const filePath = path.join(rootPath, fileName);
        return fs.readFileSync(filePath);
      }
    }
    return undefined;
  }
}
