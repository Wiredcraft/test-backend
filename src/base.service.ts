import { NotFoundException } from '@nestjs/common'
import { Model, FilterQuery, Types } from 'mongoose';
import { omit } from 'lodash';

/**
 * @description Base service with common methods and default strategy
 * @todo should limit query filtering to only allow certain fields
 * @todo may need to support native populate and custom way to populate
 */
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

    if (!data) throw new NotFoundException('Not found');

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
    if (!result) throw new NotFoundException('Not found');

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

    if (!result) throw new NotFoundException('Not found');

    return {};
  }
}
