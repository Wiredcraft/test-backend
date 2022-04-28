import fs from 'fs';
import path from 'path';
import lo from 'lodash';
import Debug from 'debug';
import KoaRouter from '@koa/router';

import config from '../common/config';

const debug = Debug('service:index');


// the name of the current module entrance
const baseName = path.basename(module.filename);
/**
 * load all services
 * @returns {any[]} all services
 */
const  allService: any[] = [];

function getAllService(dirPath: string) {
  const stat = fs.readdirSync(dirPath);
  if (stat) {
    const files = fs.readdirSync(dirPath);
    files.filter(file => {
      return file !== baseName;
    }).forEach(file => {
      const fPath = path.resolve(dirPath, file);
      const fStat = fs.statSync(fPath);
      // 当为文件夹时进行递归
      if (fStat.isDirectory()) {
        getAllService(fPath);
      } else if (fStat.isFile()) {
        if (/\.service\.(ts|js)$/.test(file)) {
          debug('loading service from: ', file);
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          let service = require(fPath);
          // import service from fPath;
          service = service.default || service;
          if (lo.isFunction(service)) {
            allService.push(service);
          } else {
            debug(' invalid service:', file);
          }
        }
      }
    });
  }
  return allService;
}

const router = () => {
  // router.use('/page', page.routes(), page.allowedMethods())

  const koaRoute = new KoaRouter();
  const defPrefix: string = config.get('App.prefix');
  const serverPrefix = defPrefix || '/api';
  // all services add prefix 'api'
  koaRoute.prefix(serverPrefix);

  console.log('---------------services loading!----------------\n');

  const services = getAllService(__dirname);
  for(const service of services) {
    const serviceObj = service();
    const { router, url, name } = serviceObj;
    koaRoute.use(url, router.routes(), router.allowedMethods());
    console.log(`service: ${name} is loaded!, url: ${serverPrefix}${url}`);
  }

  console.log('\n---------------services loaded!-----------------');
  return koaRoute;
};

export default router();