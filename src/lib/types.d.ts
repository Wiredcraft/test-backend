import { Context, Next } from 'koa';

export type Id = string | number;
export type NullableId = Id | null;

/**
 *  declare REST api function
 */
export interface IServiceMethods<T> {
  [key: string]: any;

  // POST
  create(ctx: Context, next: Next, data: any): Promise<T | T[]>

  // GET '/:id'
  find(ctx: Context, next: Next, params?: any): Promise<T | T[]>;

  // GET '/'
  get(ctx: Context, next: Next, id: Id, params?: any): Promise<T>;

  // PUT
  update(ctx: Context, next: Next, id: NullableId, data: any, params?: any): Promise<T | T[]>;

  // PATCH
  patch(ctx: Context, next: Next, id: NullableId, data: any, params?: any): Promise<T | T[]>;

  // DELETE
  remove(ctx: Context, next: Next, id: NullableId, params?: any): Promise<T | T[]>;

}