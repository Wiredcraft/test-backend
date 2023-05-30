import { PopulateOptions, QueryOptions, Types, Query } from 'mongoose';
import { MongoError } from 'mongodb';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsOptional, Max, Min } from 'class-validator';
import { ReturnModelType, DocumentType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';

import { BaseModel } from '../entity/base';
import MyError from '../util/my-error';
export type OrderType<T> = Record<
  keyof T,
  'asc' | 'desc' | 'ascending' | 'descending' | 1 | -1
>;

export type QueryList<T extends BaseModel> = Query<
  Array<DocumentType<T>>,
  DocumentType<T>
>;
export type QueryItem<T extends BaseModel> = Query<
  DocumentType<T>,
  DocumentType<T>
>;

/**
 * Describes generic pagination params
 */
export abstract class PaginationParams<T> {
  /**
   * Pagination limit
   */
  @IsOptional()
  @Min(1)
  @Max(50)
  @Transform((params: TransformFnParams) => {
    const val = params.value as string; // 将值断言为 string 类型
    return parseInt(val, 10) || 10;
  })
  public readonly limit = 10;

  /**
   * Pagination offset
   */
  @IsOptional()
  @Min(0)
  @Transform((params: TransformFnParams) => {
    const val = params.value as string; // 将值断言为 string 类型
    return parseInt(val, 10) || 10;
  })
  public readonly offset: number;

  /**
   * Pagination page
   */
  @IsOptional()
  @Min(1)
  @Transform((params: TransformFnParams) => {
    const val = params.value as string; // 将值断言为 string 类型
    return parseInt(val, 10) || 10;
  })
  public readonly page: number;

  /**
   * OrderBy
   */
  @IsOptional()
  public abstract readonly order?: OrderType<T>;
}

/**
 * 分页器返回结果
 * @export
 * @interface Paginator
 * @template T
 */
export interface Paginator<T> {
  /**
   * 分页数据
   */
  items: T[];
  /**
   * 总条数
   */
  total: number;
  /**
   * 一页多少条
   */
  limit: number;
  /**
   * 偏移
   */
  offset?: number;
  /**
   * 当前页
   */
  page?: number;
  /**
   * 总页数
   */
  pages?: number;
}

export abstract class BaseService<T extends BaseModel> {
  constructor(protected model: ReturnModelType<AnyParamConstructor<T>>) {}

  /**
   * @description 抛出mongodb异常
   * @protected
   * @static
   * @param {MongoError} err
   * @memberof BaseService
   */
  protected static throwMongoError(err: MongoError): void {
    throw new MyError(JSON.stringify(err), 500);
  }

  /**
   * @description 将字符串转换成ObjectId
   * @protected
   * @static
   * @param {string} id
   * @returns {Types.ObjectId}
   * @memberof BaseService
   */
  protected static toObjectId(id: string): Types.ObjectId {
    try {
      return new Types.ObjectId(id);
    } catch (e) {
      this.throwMongoError(e);
    }
  }

  /**
   * @description 获取指定条件全部数据
   * @param {*} conditions
   * @param {(Object | string)} [projection]
   * @param {({
   *     sort?: OrderType<T>;
   *     limit?: number;
   *     skip?: number;
   *     lean?: boolean;
   *     populates?: PopulateOptions[] | PopulateOptions;
   *     [key: string]: any;
   *   })} [options]
   * @returns {QueryList<T>}
   */
  public findAll(
    conditions: any,
    projection?: object | string,
    options: {
      sort?: OrderType<T>;
      limit?: number;
      skip?: number;
      lean?: boolean;
      populates?: PopulateOptions[] | PopulateOptions;
      [key: string]: any;
    } = {}
  ): QueryList<T> {
    return this.model.find(conditions, projection, options);
  }

  /**
   * @description 获取带分页数据
   * @param {PaginationParams<T>} conditions
   * @param {(Object | string)} [projection]
   * @param {({
   *     lean?: boolean;
   *     populates?: PopulateOptions[] | PopulateOptions;
   *     [key: string]: any;
   *   })} [options={}]
   * @returns {Promise<Paginator<T>>}
   */
  public async paginator(
    conditions: PaginationParams<T>,
    projection?: object | string,
    options: {
      lean?: boolean;
      populates?: PopulateOptions[] | PopulateOptions;
      [key: string]: any;
    } = {}
  ): Promise<Paginator<T>> {
    const { limit, offset, page, order, ...query } = conditions;

    // 拼装分页返回参数
    const result: Paginator<T> = {
      items: [],
      total: 0,
      limit,
      offset: 0,
      page: 1,
      pages: 0,
    };

    // 拼装查询配置参数
    options.sort = order;
    options.limit = limit;

    // 处理起始位置
    if (offset !== undefined) {
      result.offset = offset;
      options.skip = offset;
    } else if (page !== undefined) {
      result.page = page;
      options.skip = (page - 1) * limit;
      result.pages = Math.ceil(result.total / limit) || 1;
    } else {
      options.skip = 0;
    }

    try {
      // 获取分页数据
      result.items = await this.findAll(query, projection, options);
      // 获取总条数
      result.total = await this.count(query);
      // 返回分页结果
      return Promise.resolve(result);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  /**
   * @description 创建一条数据
   * @param {Partial<T>} docs
   * @returns {Promise<DocumentType<T>>}
   */
  public async create(docs: Partial<T>): Promise<any> {
    try {
      return await this.model.create(docs);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  /**
   * @description 根据id获取单条数据
   * @param {(string)} id
   * @param {(Object | string)} [projection]
   * @param {({
   *     lean?: boolean;
   *     populates?: PopulateOptions[] | PopulateOptions;
   *     [key: string]: any;
   *   })} [options={}]
   * @returns {QueryItem<T>}
   */
  public findById(
    id: string,
    projection?: object | string,
    options: {
      lean?: boolean;
      populates?: PopulateOptions[] | PopulateOptions;
      [key: string]: any;
    } = {}
  ): QueryItem<T> {
    return this.model.findById(BaseService.toObjectId(id), projection, options);
  }

  /**
   * @description 获取单条数据
   * @param {*} conditions
   * @param {(Object | string)} [projection]
   * @param {({
   *     lean?: boolean;
   *     populates?: ModelPopulateOptions[] | ModelPopulateOptions;
   *     [key: string]: any;
   *   })} [options]
   * @returns {QueryItem<T>}
   */
  public findOne(
    conditions: any,
    projection?: object | string,
    options: {
      lean?: boolean;
      populates?: PopulateOptions[] | PopulateOptions;
      [key: string]: any;
    } = {}
  ): QueryItem<T> {
    return this.model.findOne(conditions, projection || {}, options);
  }

  public findOneAsync(
    conditions: any,
    projection?: object | string,
    options: {
      lean?: boolean;
      populates?: PopulateOptions[] | PopulateOptions;
      [key: string]: any;
    } = {}
  ): Promise<T | null> {
    try {
      const { populates = null, ...option } = options;
      const docsQuery = this.findOne(conditions, projection || {}, option);
      return this.populates<T>(docsQuery, populates).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  /**
   * @description 获取指定查询条件的数量
   * @param {*} conditions
   * @returns {Query<number>}
   */
  public count(conditions: any): Query<number, any> {
    return this.model.count(conditions);
  }

  public countAsync(conditions: any): Promise<number> {
    try {
      return this.count(conditions).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  /**
   * @description 删除指定数据
   * @param {(any)} id
   * @param {QueryOptionsWithLean} options
   * @returns {QueryItem<T>}
   */
  public delete(conditions: any, options?: QueryOptions): QueryItem<T> {
    return this.model.findOneAndDelete(conditions, options);
  }

  public async deleteAsync(
    conditions: any,
    options?: QueryOptions
  ): Promise<DocumentType<T>> {
    try {
      return await this.delete(conditions, options).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  /**
   * @description 更新指定id数据
   * @param {string} id
   * @param {Partial<T>} update
   * @param {QueryFindOneAndUpdateOptions} [options={ new: true }]
   * @returns {QueryItem<T>}
   */
  public update(
    id: string,
    update: Partial<T>,
    options: QueryOptions = { new: true }
  ): QueryItem<T> {
    return this.model.findByIdAndUpdate(
      BaseService.toObjectId(id),
      update,
      options
    );
  }

  /**
   * @description 填充其他模型
   * @private
   * @template D
   * @param {DocumentQuery<D, DocumentType<T>, {}>} docsQuery
   * @param {(ModelPopulateOptions | ModelPopulateOptions[] | null)} populates
   * @returns {DocumentQuery<D, DocumentType<T>, {}>}
   */
  private populates<D>(
    docsQuery: Query<D, DocumentType<T>>,
    populates: PopulateOptions | PopulateOptions[] | null
  ): Query<D, DocumentType<T>> {
    if (populates) {
      [].concat(populates).forEach((item: PopulateOptions) => {
        docsQuery.populate(item);
      });
    }
    return docsQuery;
  }
}
