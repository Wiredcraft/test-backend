import { Op } from 'sequelize';
import * as models from '../models';
import { unixTime, Password } from '../libraries';
import * as errors from '../libraries/errors';

export class UserController {
  count() {
    return models.UserModel.count({
      where: {
        deletedAt: null,
      },
    });
  }

  list(options: { offset: number; limit: number }) {
    return models.UserModel.findAll({
      where: {
        id: {
          [Op.gte]: options.offset,
        },
        deletedAt: null,
      },
      limit: options.limit,
      order: [['id', 'ASC']],
    });
  }

  async create(options: {
    name: string;
    dob: number;
    address: string;
    description: string;
    location?: Location;
    role?: string;
    password: string;
  }) {
    const now = unixTime();
    const password = new Password(options.password);
    const passwordHash = await password.hash();
    const values = Object.assign(
      { ...options },
      {
        password: JSON.stringify(passwordHash),
        createdAt: now,
        updatedAt: now,
      }
    );
    return models.UserModel.create(values);
  }

  async get(id: number) {
    const user = await models.UserModel.findOne({
      where: { id, deletedAt: null },
    });
    if (!user) {
      throw new errors.UserNotFound();
    }
    return user;
  }

  async delete(id: number) {
    const user = await this.get(id);
    await user.update({
      deletedAt: unixTime(),
    });
  }

  async update(
    id: number,
    options: {
      name?: string;
      dob?: number;
      address?: string;
      description?: string;
      location?: Location;
      role?: string;
      password?: string;
    }
  ) {
    const values = { ...options };
    if (values.password) {
      const password = new Password(values.password);
      const passwordHash = await password.hash();
      values.password = JSON.stringify(passwordHash);
    }
    Object.assign(values, {
      updatedAt: unixTime(),
    });
    const user = await this.get(id);
    return user.update(values);
  }
}
