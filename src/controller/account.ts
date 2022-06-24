import assert from 'assert';
import { Context } from 'koa';
import { validate } from 'class-validator';
import { User } from '../entity/user';
import { AccountService } from '../service/account';
import { Inject, Provide } from '../util/container';
import { Controller, Post } from '../util/web';
import { ERROR } from '../config/constant';

@Provide()
@Controller('/account')
export class AccountController {
  @Inject()
  accountService: AccountService;

  @Post('/signup')
  async signUp(ctx: Context) {
    // TODO send validate code, and check it

    // 1. validate the user data
    const userData = User.fromJSON(ctx.request.body);
    const errors = await validate(userData);
    assert(errors.length === 0, ERROR.ParameterValidationError(errors));

    // 2. Sign up
    const newUser = await this.accountService.signUp(userData);

    ctx.body = newUser.toJson();
  }

  @Post('/signin')
  async signIn(ctx: Context) {
    const { email, password } = ctx.request.body;
    assert(typeof email === 'string', ERROR.ParameterError('email'));
    assert(typeof password === 'string', ERROR.ParameterError('password'));

    const user = await this.accountService.signIn(email, password);
    const userData = user.toJson();
    assert(ctx.session);

    ctx.session.user = userData;
    ctx.body = userData;
  }
}
