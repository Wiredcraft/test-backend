import { Command } from './command';
import { context } from '../context';
import { MigrationController } from '../controllers';
import { MigrationModel } from '../models';

export class MigrationInitCommand implements Command {
  get name() {
    return 'migration:init';
  }

  get options() {
    return {};
  }

  async run() {
    const migrationController = new MigrationController();
    await migrationController.init();
    await migrationController.sync();
    context.logger.info(`Migration initialized`);
  }
}

export class MigrationCreateCommand implements Command {
  get name() {
    return 'migration:create';
  }

  get options() {
    return {
      string: ['name', 'template'],
    };
  }

  async run(options: { name: string; template?: string }) {
    if (!options.name) {
      throw new Error('Migration name is required');
    }
    const template = options.template || 'model';
    const migrationController = new MigrationController();
    const info = await migrationController.create(options.name, template);
    await migrationController.sync();
    context.logger.info(`Migration file created at: ${info.filePath}`);
  }
}

export class MigrationUpCommand implements Command {
  get name() {
    return 'migration:up';
  }

  get options() {
    return {
      number: ['steps'],
      boolean: ['fake'],
    };
  }

  async run(options: { steps?: number; fake?: boolean } = {}) {
    const migrationController = new MigrationController();
    await migrationController.sync();

    const migrations = await MigrationModel.findAllUpable();
    if (migrations.length === 0) {
      context.logger.info(`No available migrations`);
      return;
    }

    let limit = migrations.length;
    if (options.steps && options.steps > 0 && options.steps <= limit) {
      limit = options.steps;
    }

    for (let i = 0; i < limit; ++i) {
      const migration = migrations[i];
      context.logger.info(`Migration up: ${migration.name}`);
      if (!options.fake) {
        await migrationController.process(migration.id, 'up');
      }
    }
  }
}

export class MigrationDownCommand implements Command {
  get name() {
    return 'migration:down';
  }

  get options() {
    return {
      number: ['steps'],
      boolean: ['fake'],
    };
  }

  async run(options: { steps?: number; fake?: boolean }) {
    const migrationController = new MigrationController();
    await migrationController.sync();

    const migrations = await MigrationModel.findAllDownable();
    if (migrations.length === 0) {
      context.logger.info(`No available migrations`);
      return;
    }

    let limit = 1;
    if (options.steps && options.steps >= limit && options.steps <= migrations.length) {
      limit = options.steps;
    }

    for (let i = 0; i < limit; ++i) {
      const migration = migrations[i];
      context.logger.info(`Migration down: ${migration.name}`);
      if (!options.fake) {
        await migrationController.process(migration.id, 'down');
      }
    }
  }
}

export class MigrationStatusCommand implements Command {
  get name() {
    return 'migration:status';
  }

  get options() {
    return {};
  }

  async run() {
    const migrationController = new MigrationController();
    const status = await migrationController.getStatus();
    if (status.length === 0) {
      context.logger.info(`Migration status: void`);
      return;
    }
    context.logger.info(`Migration status:`);
    for (const item of status) {
      context.logger.info(`${item.name}: ${item.status}`);
    }
  }
}
