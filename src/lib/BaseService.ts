import KoaRouter from '@koa/router';
import { Context, Next } from 'koa';
import lo from 'lodash';
import { MHttpError } from '../common/constants';
import { Id, IServiceMethods, NullableId } from './types';

const { get } = lo;

/**
 *  base service
 */
class BaseService implements IServiceMethods<any> {
  public router: KoaRouter;
  public model: any;
  public name: string;
  public url: string;

  constructor(model: any, name: string, url: string) {
    this.router = new KoaRouter();
    this.model = model;
    this.name = name;
    this.url = url;
    this.setUp(this.router);
  }

  /**
   *  serveice add extension and log request args
   * @param {Context} ctx koa context
   * @param {string} serviceMethod create | get | find | update | patch | remove
   */
  private serviceExpandHandler(ctx: Context, serviceMethod: string) {
    ctx.__serviceName = this.name;
    ctx.__serviceMethod = serviceMethod;
    const { params: { id }, query } = ctx;
    const body = get(ctx, ['request', 'body']);
    let infoMsg = `${ctx.request.url} ${this.name} ${serviceMethod} request: < `;
    const mQuery = JSON.stringify(Object.assign({}, query), null, 2);
    const mBody = JSON.stringify(body, null, 2);
    if (serviceMethod === 'create') {
      infoMsg += ` body: ${mBody}, query: ${mQuery} >`;
    } else if (['get', 'update', 'patch', 'remove'].includes(serviceMethod)) {
      infoMsg += `id: ${id},`;
      if (['update', 'patch'].includes(serviceMethod)) {
        infoMsg += ` body: ${mBody}, query: ${mQuery} >`;
      } else if (serviceMethod === 'remove') {
        infoMsg += ` query: ${mQuery} >`;
      } else {
        infoMsg += ' >';
      }
      if (!!!id) {
        ctx.logger.info(infoMsg);
        throw MHttpError.ERROR_PARAMS_ERROR(this.name, serviceMethod, 'id is required');
      }
    }
    else if (serviceMethod === 'find') {
      infoMsg += ` query: ${mQuery} >`;
    }
    ctx.logger.info(infoMsg);
  }

  /**
   * set up routing distribution rules
   * @param {@koa/router} router
   * @returns {@koa/router}
   */
  private setUp(router: KoaRouter) {
    router.post('/',async (ctx, next) => {// create
      const body = get(ctx, ['request', 'body']);
      this.serviceExpandHandler(ctx, 'create');
      await this.create(ctx, next, body);
      // try {
      //   this.serviceExpandHandler(ctx, 'create');
      //   // const res =
      //   await this.create(ctx, next, body);
      //   // ctx.successResult(res);
      // } catch (error) {
      //   console.log('create error:', JSON.stringify(error, null, 2));
      //   ctx.body = error;
      // }
    }).get('/:id', async (ctx, next)=>{// get
      const { params: { id, ortherArgs} } = ctx;
      this.serviceExpandHandler(ctx, 'get');
      await this.get(ctx, next, id, ortherArgs);
    }).get('/', async ( ctx, next )=>{// find
      this.serviceExpandHandler(ctx, 'find');
      await this.find(ctx, next, ctx.query);
    }).put('/:id', async (ctx, next) => {// update
      const body = get(ctx, ['request', 'body']);
      const { params: { id } } = ctx;
      this.serviceExpandHandler(ctx, 'put');
      await this.update(ctx, next, id, body);
    }).patch('/:id', async (ctx, next) => {// patch
      const body = get(ctx, ['request', 'body']);
      const { params: { id } } = ctx;
      this.serviceExpandHandler(ctx, 'patch');
      await this.patch(ctx, next, id, body);
    }).delete('/:id', async ( ctx, next ) => {// remove
      const { params: { id } } = ctx;
      this.serviceExpandHandler(ctx, 'remove');
      await this.remove(ctx, next, id);
    });
    return router;
  }

  async create(ctx: Context, next: Next, data: any): Promise<any> {
    throw MHttpError.ERROR_NOTIMPLEMENTED(this.name, 'create');
  }
  async find(ctx: Context, next: Next, params?: any): Promise<any> {
    throw MHttpError.ERROR_NOTIMPLEMENTED(this.name, 'find');
  }
  async get(ctx: Context, next: Next, id: Id, params?: any): Promise<any> {
    throw MHttpError.ERROR_NOTIMPLEMENTED(this.name, 'get');
  }
  async update(ctx: Context, next: Next, id: Id, data: any, params?: any): Promise<any> {
    throw MHttpError.ERROR_NOTIMPLEMENTED(this.name, 'update');
  }
  async patch(ctx: Context, next: Next, id: Id, data: any, params?: any): Promise<any> {
    throw MHttpError.ERROR_NOTIMPLEMENTED(this.name, 'patch');
  }
  async remove(ctx: Context, next: Next, id: Id, params?: any): Promise<any> {
    throw MHttpError.ERROR_NOTIMPLEMENTED(this.name, 'remove');
  }


}

export default BaseService;