import { Model, FilterQuery, Types } from 'mongoose';
import { omit } from 'lodash';

class HttpException extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
  }
}

export abstract class BaseService<T extends { _id: string | Types.ObjectId }> {
  private defaultOmitFields = ['__v'];
  protected abstract readonly model: Model<T>;
  protected abstract readonly omitFields: string[];

  async create(payload: Partial<T>) {
    const data = await this.model.create({
      ...payload,
      createdAt: Date.now(),
    });
    return omit(data.toJSON(), this.omitFields.concat(this.defaultOmitFields));
  }

  async getOne(filter: FilterQuery<T>) {
    if (filter._id) filter._id = new Types.ObjectId(filter._id);
    const data = await this.model.findOne(filter);

    return omit(data.toJSON(), this.omitFields.concat(this.defaultOmitFields));
  }

  async getOneOrFailed(filter: FilterQuery<T>) {
    const data = await this.getOne(filter);

    if (!data) throw new HttpException('Not found', 404);

    return data;
  }

  async find(filter: FilterQuery<T>, take = 12, skip = 0) {
    const data = await this.model
      .find(filter)
      .skip(skip)
      .limit(take)
      .exec();
    return data.map(d =>
      omit(d.toJSON(), this.omitFields.concat(this.defaultOmitFields)),
    );
  }

  async updateById(id: string | Types.ObjectId, data: Partial<T>) {
    const result = await this.model.findByIdAndUpdate(id, data, { new: true });

    if (!result) throw new HttpException('Not found', 404);

    return omit(
      result.toJSON(),
      this.omitFields.concat(this.defaultOmitFields),
    );
  }

  async deleteById(id: string | Types.ObjectId) {
    const result = await this.model.findByIdAndUpdate(
      id,
      { archived: true },
      { new: true },
    );

    if (!result) throw new HttpException('Not found', 404);

    return true;
  }
}
