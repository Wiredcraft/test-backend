import { DateTime } from 'luxon';
import { Command } from './command';
import { context } from '../context';
import { unixTime } from '../libraries';
import * as controllers from '../controllers';
import * as models from '../models';

const buildUser = (i: number, password: string) => ({
  name: `user-${i}`,
  dob: unixTime(),
  address: `address-${i}`,
  description: `description-${i}`,
  location: [i, i] as Location,
  email: `user-${i}@gmail.com`,
  password: `${password}`,
});

export class UserFillCommand implements Command {
  get name() {
    return 'user:fill';
  }

  get options() {
    return {
      number: ['count'],
      string: ['password'],
      default: {
        count: 10,
        password: '12345678',
      },
    };
  }

  async run(options: { count: number; password: string }) {
    context.logger.info('Creating users...');
    const userController = new controllers.UserController();
    const userModels = [];
    for (let i = 1; i <= options.count; ++i) {
      const user = buildUser(i, options.password);
      const userModel = await userController.create(user);
      context.logger.info(JSON.stringify(userModel.toJSON(), undefined, 2));
      userModels.push(userModel);
    }
    if (userModels.length >= 2) {
      context.logger.info('Making friends...');
      const me = userModels[0];
      const friends = userModels.slice(1);
      for (const friend of friends) {
        await Promise.all([
          userController.follow(me.id, friend.id),
          userController.follow(friend.id, me.id),
        ]);
      }
    }
  }
}

export class UserClearCommand implements Command {
  get name() {
    return 'user:clear';
  }

  get options() {
    return {
      number: ['count'],
      string: ['password'],
      default: {
        count: 10,
        password: '12345678',
      },
    };
  }

  async run(options: { count: number; password: string }) {
    context.logger.info('Clear users...');
    const userController = new controllers.UserController();
    for (let i = 1; i <= options.count; ++i) {
      context.logger.info(`Delete user ${i}`);
      const user = buildUser(i, options.password);
      try {
        const userModel = await userController.verifyAccount({
          email: user.email,
          password: options.password,
        });
        await userController.delete(userModel.id);
        await userModel.destroy();
      } catch (err) {
        context.logger.warn(err);
      }
    }
  }
}

export class UserSessionExpireCommand implements Command {
  get name() {
    return 'user:session:expire';
  }

  get options() {
    return {
      number: ['days'],
      default: {
        days: 30,
      },
    };
  }

  async run(options: { days: number }) {
    context.logger.info('Expire user sessions...');
    const endAt = DateTime.fromSeconds(unixTime()).minus({ days: options.days }).toSeconds();
    const ids = await models.UserSessionModel.list();
    for (const id of ids) {
      const session = await models.UserSessionModel.find(id);
      if (session && session.createdAt < endAt) {
        context.logger.info(`Expire user session: ${id}`);
        await models.UserSessionModel.delete(id);
      }
    }
  }
}
