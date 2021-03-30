import { NewUser, User, UserId } from '../../domain/user.interface';
import { UserNotFoundException } from '../../domain/user.exception';
import { UserRepository } from '../../domain/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserInMongo, UserDocument } from './user.schema';
import { Model, isValidObjectId } from 'mongoose';
import { Logger } from '@nestjs/common';

/**
 * Remove Mongo related properties from the Document class.
 * To avoid needless confusion, call this method before we publish the loaded value to the presentation tier.
 * @param object The object to remove properties.
 */
// TODO find better way like https://gist.github.com/cadebward/c8161e13d7e5270cb7ff
function mapToEntity(doc: UserDocument): User {
  if (!doc) return null;

  return {
    id: doc._id,
    name: doc.name,
    address: doc.address,
    dob: doc.dob,
    description: doc.description,
    createdAt: doc.createdAt,
  };
}

function mapToMongo(entity: User): UserInMongo {
  return {
    name: entity.name,
    address: entity.address,
    dob: entity.dob,
    description: entity.description,
    createdAt: entity.createdAt,
  };
}

const CONTEXT = 'MongoUserRepository';

export class MongoUserRepository extends UserRepository {
  constructor(
    @InjectModel(UserInMongo.name) private userModel: Model<UserDocument>,
  ) {
    super();
  }

  async list(): Promise<IterableIterator<User>> {
    const documents = await this.userModel.find().exec();
    return documents.map(mapToEntity).values();
  }

  async create(user: NewUser): Promise<User> {
    const createdUser = new this.userModel(user);
    const doc = await createdUser.save();
    return mapToEntity(doc);
  }

  async update(user: User): Promise<void> {
    if (!isValidObjectId(user.id)) {
      Logger.debug(
        `Given UserId is unexpectedly formatted as UserId: ${user.id}`,
        CONTEXT,
      );
      throw new UserNotFoundException(user.id);
    }
    const result = await this.userModel
      .updateOne({ _id: user.id }, mapToMongo(user))
      .exec();
    if (result.n !== 1) {
      Logger.debug(
        `Mongo updated no user, probably we have no User with the given UserId: ${user.id}. Value of n returned from Mongo is ${result.n}`,
        CONTEXT,
      );
      throw new UserNotFoundException(user.id);
    }
  }

  async load(id: UserId): Promise<User | undefined> {
    if (!isValidObjectId(id)) {
      Logger.debug(
        `Given UserId is unexpectedly formatted as UserId: ${id}`,
        CONTEXT,
      );
      throw new UserNotFoundException(id);
    }
    const found = await this.userModel.findById(id).exec();
    if (found) {
      return mapToEntity(found);
    } else {
      throw new UserNotFoundException(id);
    }
  }

  async delete(id: UserId): Promise<void> {
    if (!isValidObjectId(id)) {
      Logger.debug(
        `Given UserId is unexpectedly formatted as UserId: ${id}`,
        CONTEXT,
      );
      throw new UserNotFoundException(id);
    }
    const result = await this.userModel.deleteOne({ _id: id }).exec();

    if (result.deletedCount !== 1) {
      Logger.debug(
        `Mongo deleted no user, probably we have no User with the given UserId: ${id}`,
        CONTEXT,
      );
      throw new UserNotFoundException(id);
    }
  }

  async deleteAll(): Promise<void> {
    await this.userModel.deleteMany({}).exec();
  }
}
