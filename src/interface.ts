import { Context as KoaContext } from 'koa';
import session from 'koa-session';

export interface Context extends KoaContext {
  session: session.Session;
}
