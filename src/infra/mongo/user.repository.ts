import { NewUser, User, UserId } from '../../domain/user.interface';
import { UserNotFoundException } from '../../domain/user.exception';
import { UserRepository } from '../../domain/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserInMongo, UserDocument } from './user.schema';
import { Model, isValidObjectId } from 'mongoose';

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
    return Promise.resolve(mapToEntity(createdUser));
  }

  update(user: User): Promise<void> {
    if (!isValidObjectId(user.id)) {
      throw new UserNotFoundException(user.id);
    }
    return new Promise(async (resolve) => {
      const updatedUser = this.userModel
        .findByIdAndUpdate(user.id, mapToMongo(user))
        .exec()
        .then(() => {
          resolve(void 0);
        });
    });
  }

  async load(id: UserId): Promise<User | undefined> {
    if (!isValidObjectId(id)) {
      return Promise.reject(new UserNotFoundException(id));
    }
    const found = await this.userModel.findById(id).exec();
    if (found) {
      return mapToEntity(found);
    } else {
      return Promise.reject(new UserNotFoundException(id));
    }
  }

  delete(id: UserId): Promise<void> {
    if (!isValidObjectId(id)) {
      return Promise.reject(new UserNotFoundException(id));
    }
    return new Promise((resolve, reject) => {
      this.userModel
        .findByIdAndDelete(id)
        .exec()
        .then((result) => {
          if (!result) {
            reject(new UserNotFoundException(id));
          }
          resolve(void 0);
        });
    });
  }

  deleteAll(): Promise<void> {
    return new Promise(async (resolve) => {
      await this.userModel.deleteMany({}).exec();
      resolve(void 0);
    });
  }
}
