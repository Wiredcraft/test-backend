import bodyParser from 'koa-bodyparser';
import { Config, Provide } from '../util/container';
import { Middleware } from '../util/web';

@Provide()
export class BodyParser {
  @Config('bodyParser')
  options: bodyParser.Options;

  @Middleware()
  init() {
    return bodyParser(this.options);
  }
}
