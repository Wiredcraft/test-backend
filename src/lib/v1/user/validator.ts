import { AnyZodObject, z } from 'zod';
import { get } from 'lodash'
import dayjs from 'dayjs';
import { Next, Context } from 'koa';

import { config } from '../../../config';
import { createRouteParams, listRouteParams, patchRouteParams, updateRouteParams } from './types';
import { ERRORS } from '../../../consts';

export const validatorPatchRoute = (params: AnyZodObject) =>
  async (ctx: Context, next: Next) => {
    try {
      const rawParams: patchRouteParams = {
        userId: get(ctx, "request.params.userId") as string,
        name: ctx.request.body.name as string,
        dob: ctx.request.body.dob as string,
        address: ctx.request.body.address as string,
        description: ctx.request.body.description as string,
      };
      ctx.body = await params.parseAsync(rawParams);
      return next();
    } catch (e) {
      throw ERRORS.generic.validation.failed('', e);
    }
  };

export const validatorPostRoute = (params: AnyZodObject) =>
  async (ctx: Context, next: Next) => {
    try {
      const rawParams: createRouteParams = {
        name: ctx.request.body.name as string,
        dob: ctx.request.body.dob as string,
        address: ctx.request.body.address as string,
        description: ctx.request.body.description as string,
      };
      ctx.body = await params.parseAsync(rawParams);
      return next();
    } catch (e) {
      throw ERRORS.generic.validation.failed('', e);
    }
  };

export const validatorUpdateRoute = (params: AnyZodObject) =>
  async (ctx: Context, next: Next) => {
    try {
      const rawParams: updateRouteParams = {
        userId: get(ctx, "request.params.userId") as string,
        name: ctx.request.body.name as string,
        dob: ctx.request.body.dob as string,
        address: ctx.request.body.address as string,
        description: ctx.request.body.description as string,
      };
      ctx.body = await params.parseAsync(rawParams);
      return next();
    } catch (e) {
      throw ERRORS.generic.validation.failed('', e);
    }
  };


export const validatorListRoute = (params: AnyZodObject) =>
  async (ctx: Context, next: Next) => {
    try {
      const rawParams: listRouteParams = {
        perPage: Number.parseFloat(ctx.request.query.perPage as string),
        page: Number.parseFloat(ctx.request.query.page as string),
        orderDir: ctx.request.query.orderDir as 'asc' | 'desc',
        orderBy: ctx.request.query.orderBy as string,
      };
      ctx.body = await params.parseAsync(rawParams);
      return next();
    } catch (e) {
      throw ERRORS.generic.validation.failed('', e);
    }
  };

const dateOfBirthValidator = z.preprocess((arg) => {
  if (typeof arg == 'string' || arg instanceof Date) return new Date(arg);
}, z.date({
  invalid_type_error: 'dob has to be a valid date',
  required_error: 'please add a date of birth as dob',
}).transform(arg => {
  return dayjs(arg).toISOString()
}));

const descriptionValidator = z.string({
  invalid_type_error: 'description has to be a string',
  required_error: 'please add a description',
});

const nameValidator = z.string({
  invalid_type_error: 'name has to be a string',
  required_error: 'please add a name',
});

const userIdValidator = z.string({
  invalid_type_error: 'userId has to be a string',
  required_error: 'please add a userId',
});

const addressValidator = z.string({
  invalid_type_error: 'name has to be a string',
  required_error: 'please add a name',
});


export const listSchema = z.object({
  perPage: z
    .preprocess(val => {
      if (Number.isFinite(val)) return val;
      return config.pagination.userList.defaultPerPage;
    }, z.number({
      invalid_type_error: 'perPage has to be a number',
      description: 'perPage is the number of user that will be returned per page',
    })
      .positive('Can\'t display a negative number of user...')
      .max(config.pagination.userList.maxPerPage)
      .optional().default(config.pagination.userList.defaultPerPage))
  ,
  page: z.preprocess(val => {
    if (Number.isFinite(val)) return val;
    return 1;
  }, z.number({
    invalid_type_error: 'perPage has to be a number',
    description: 'page is used to determine how much user have to be skipped',
  }).optional().default(1)),
  orderBy: z
    .enum(['dob', 'name', 'createdAt', 'updatedAt'] as const)
    .optional()
    .default('createdAt'),
  orderDir: z
    .enum(['asc', 'desc'] as const)
    .optional()
    .default('desc'),
});

export const patchSchema = z.object({
  dob: dateOfBirthValidator.optional(),
  description: descriptionValidator.optional(),
  userId: userIdValidator,
  name: nameValidator.optional(),
  address: addressValidator.optional(),
});

export const putSchema = z.object({
  dob: dateOfBirthValidator,
  description: descriptionValidator,
  userId: userIdValidator,
  name: nameValidator,
  address: addressValidator,
});

export const postSchema = z.object({
  dob: dateOfBirthValidator,
  description: descriptionValidator,
  name: nameValidator,
  address: addressValidator,
});
