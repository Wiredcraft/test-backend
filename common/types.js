const Koa = require('koa');

/**
 * @typedef {{
  *  debug(message: any, ...args: any[]): void,
  *  info(message: any, ...args: any[]): void,
  *  warn(message: any, ...args: any[]): void,
  *  error(message: any, ...args: any[]): void,
  * }} Logger
  */

/**
 * @typedef {{
 *  ...Koa.Context,
 *  seqId: string,
 *  logger: Logger,
 *  validation?: {
 *    [key: string]?: any,
 *    body?: {
 *      [key: string]: any
 *    },
 *    query?: {
 *      [key: string]: any
 *    },
 *    params?: {
 *      [key: string]: any
 *    }
 *  },
 *  body?: any,
 *  [key: string]: any
 * }} Context
 */

/**
 * @typedef {(ctx: Context, next: Koa.Next) => Promise} Middleware
 */
