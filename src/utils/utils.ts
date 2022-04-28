import lo from 'lodash';
import { MHttpError } from '../common/constants';

/**
 * convert camel case to convsersion line string
 * @param str: string  camel case string
 * @returns: string   convsersion line string
 */
export const camel2ConversionLine = (str: string) => {
  return str.slice(0,1).toLocaleLowerCase() + str.slice(1).replace(/[A-Z]/g, (a, b) => `_${str[b].toLowerCase()}`);
};
/**
 * check the key of data
 * @param data
 * @param key to check key
 * @param type 1 | 2, 1: required and not null 2: required and nullable
 * @returns
 */
const checkArg = (data: any, key: string, type = 1) => {
  const value = data[key];

  if ((type === 1 && (value === null || value === undefined || value === ''))
    || (type === 2 && (value === null || value === undefined))) {
    const error = MHttpError.ERROR_PARAMS_ERROR(`arg \`${key}\` is required`, data[key]);
    // pick some data to response
    return lo.pick(error, ['code', 'message', 'data']);
  }
};

/**
 * verify data
 * @param data to check the data
 * @param key required and not null
 * @param key2 required and nullable
 * @returns Error | undined
 */
export const  verifyData = (data: any, key: string | string[], key2?: string | string[]) => {
  if (!data || Object.keys(data).length === 0) {
    const error = MHttpError.ERROR_PARAMS_ERROR('the \`data\` is required');
    return lo.pick(error, ['code', 'message', 'name', 'data']);
  }
  if (key && Object.keys(key).length > 0) {
    if (lo.isString(key)) {
      return checkArg(data, key);
    } else if (lo.isArray(key)) {
      for (const k of key) {
        const err = checkArg(data, k, 1);
        if (err) {
          return err;
        }
      }
    }
  }

  if (key2 && Object.keys(key2).length > 0) {
    if (lo.isString(key2)) {
      return checkArg(data, key2, 2);
    } else if (lo.isArray(key2)) {
      for (const k of key2) {
        const err = checkArg(data, k, 2);
        if (err) {
          return err;
        }
      }
    }
  }
};
import config from '../common/config';

/**
 * get the Server version and name
 * @param {number} version service version 1 | 2 ……
 * @param {string} serviceName service name
 * @returns {string} eg:/v1/serverUser
 */
export const getServiceMainUrl = (serviceName: string, version?: number): string => {
  const apiVersion = version || config.get('App.apiVersion') || 1;
  return `/v${apiVersion}/${serviceName}`;
};

/**
 *  get client ip
 * @param req
 * @returns
 */
export const getCallerIp = function (req: any): string {
  // { headers: { [x: string]: any; }; connection: { remoteAddress: any; socket: { remoteAddress: any; }; }; socket: { remoteAddress: any; }; }
  let ip = (req.headers['x-forwarded-for'] || '').split(',').pop() ||
    lo.get(req, ['connection','remoteAddress']) ||
    lo.get(req, ['socket','remoteAddress']) ||
    lo.get(req, ['connection', 'socket','remoteAddress']);
  // in case the ip returned in a format: "::ffff:146.xxx.xxx.xxx"
  ip = ip.split(':').slice(-1).toString();
  // it's 'localhost', return 127.0.0.1
  // tslint:disable-next-line: no-unused-expression
  ip === '1' && (ip = '127.0.0.1');
  return ip;
};