import { Context } from 'koa';
import { ViewService } from '../service/view';
import { Inject, Provide } from '../util/container';
import { Controller, Get } from '../util/web';

@Provide()
@Controller('/')
export class HomeController {
  @Inject()
  viewService: ViewService;

  @Get('')
  async homePage(ctx: Context) {
    ctx.body = await this.viewService.render('index');
  }
}
