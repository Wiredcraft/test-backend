import { UniqueConstraintError, Op } from 'sequelize';
import * as models from '../models';
import { unixTime, Password } from '../libraries';
import * as errors from '../libraries/errors';
import { context } from '../context';

export class UserController {
  async verifyAccount(options: { email: string; password: string }) {
    const user = await models.UserModel.findOne({
      where: {
        email: options.email,
        deletedAt: null,
      },
    });
    if (!user) {
      throw new errors.InvalidUserAccount();
    }
    const password = new Password(options.password);
    const passwordHash = JSON.parse(user.password);
    const ok = await password.verify(passwordHash);
    if (!ok) {
      throw new errors.InvalidUserAccount();
    }
    return user;
  }

  async getOrCreateSession(user: models.UserModel) {
    const session = await models.UserSessionModel.find(user.id);
    if (session) {
      return session;
    }
    return models.UserSessionModel.put(user);
  }

  async verifySession(userId: number, sessionId: string) {
    const session = await models.UserSessionModel.find(userId);
    if (!session || session.id !== sessionId) {
      throw new errors.UserSessionExpired();
    }
    return session;
  }

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
    email: string;
    password: string;
  }) {
    const now = unixTime();
    const password = new Password(options.password);
    const passwordHash = await password.hash();
    const values = {
      ...options,
      password: JSON.stringify(passwordHash),
      createdAt: now,
      updatedAt: now,
    };
    try {
      return await models.UserModel.create(values);
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new errors.UserAlreadyExists();
      } else {
        throw err;
      }
    }
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
    await models.UserSessionModel.delete(user.id);
    await context.transactional(async (transaction) => {
      // mark deleted
      await user.update(
        {
          deletedAt: unixTime(),
        },
        { transaction }
      );
      // clear links
      await models.UserLinkModel.destroy({
        where: {
          [Op.or]: {
            from: id,
            to: id,
          },
        },
        transaction,
      });
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
    const user = await this.get(id);
    const values = { ...options, updatedAt: unixTime() };
    if (values.password) {
      const password = new Password(values.password);
      const passwordHash = await password.hash();
      values.password = JSON.stringify(passwordHash);
      await models.UserSessionModel.delete(user.id);
    }
    return user.update(values);
  }

  async follow(fromId: number, toId: number) {
    if (fromId === toId) {
      throw new errors.InvalidUserLink();
    }
    await this.assertIsActive([fromId, toId]);
    try {
      await models.UserLinkModel.create({
        from: fromId,
        to: toId,
        createdAt: unixTime(),
      });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        throw new errors.UserLinkAlreadyExists();
      } else {
        throw err;
      }
    }
  }

  async unfollow(fromId: number, toId: number) {
    await this.assertIsActive([fromId, toId]);
    const link = await models.UserLinkModel.findOne({
      where: {
        from: fromId,
        to: toId,
      },
    });
    if (!link) {
      throw new errors.UserLinkNotFound();
    }
    await link.destroy();
  }

  countFollowers(id: number) {
    return models.UserLinkModel.count({
      where: {
        to: id,
      },
    });
  }

  async listFollowers(id: number, offset: number, limit: number) {
    const links = await models.UserLinkModel.findAll({
      attributes: ['from'],
      where: {
        to: id,
        from: {
          [Op.gte]: offset,
        },
      },
      order: [['id', 'ASC']],
      limit,
    });
    const followerIds = links.map((item) => item.from);
    return models.UserModel.findAll({
      where: {
        id: {
          [Op.in]: followerIds,
        },
        deletedAt: null,
      },
    });
  }

  countFollowings(id: number) {
    return models.UserLinkModel.count({
      where: {
        from: id,
      },
    });
  }

  async listFollowings(id: number, offset: number, limit: number) {
    const links = await models.UserLinkModel.findAll({
      attributes: ['to'],
      where: {
        from: id,
        to: {
          [Op.gte]: offset,
        },
      },
      order: [['id', 'ASC']],
      limit,
    });
    const followerIds = links.map((item) => item.to);
    return models.UserModel.findAll({
      where: {
        id: {
          [Op.in]: followerIds,
        },
        deletedAt: null,
      },
    });
  }

  async searchNeighbors(id: number, limit: number) {
    const origin = await this.get(id);
    if (!origin.location) {
      return [];
    }
    const [latitude, longtitude] = origin.location;
    const [results] = await context.sequelize.query(`select id, location,
    DEGREES(ACOS(LEAST(1.0, COS(RADIANS(${latitude}))
             * COS(RADIANS(X(location)))
             * COS(RADIANS(${longtitude} - Y(location)))
             + SIN(RADIANS(${latitude}))
             * SIN(RADIANS(X(location)))))) as distance
    from user where
    location is not null
    and deletedAt is null
    and id in (
      select \`from\` as id from user_link where \`to\` = ${origin.id}
      union
      select \`to\` as id from user_link where \`from\` = ${origin.id}
    )
    order by distance asc limit ${limit};`);
    const neighborIds = (results as { id: number }[]).map((item) => item.id);
    return models.UserModel.findAll({
      where: {
        id: {
          [Op.in]: neighborIds,
        },
        deletedAt: null,
      },
    });
  }

  async assertIsActive(ids: number[]) {
    const count = await models.UserModel.count({
      where: {
        id: {
          [Op.in]: ids,
        },
        deletedAt: null,
      },
    });
    if (count !== ids.length) {
      throw new errors.UserNotFound();
    }
  }
}
