import { Command } from './command';
import { context } from '../context';
import { unixTime } from '../libraries';
import * as controllers from '../controllers';

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
    context.logger.info('Creating user...');
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
    context.logger.info('Clear user...');
    const userController = new controllers.UserController();
    for (let i = 1; i <= options.count; ++i) {
      context.logger.info(`Delete user ${i}`);
      const user = buildUser(i, options.password);
      try {
        const userModel = await userController.verify({
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
