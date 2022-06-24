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

  /**
   * POST /account/signup
   *
   * @param ctx
   */
  @Post('/signup')
  async signUp(ctx: Context) {
    // TODO send validate code, and check it

    // 1. validate the user data
    const userData = User.fromJSON(ctx.request.body);
    const errors = await validate(userData);
    assert(errors.length === 0, ERROR.ParameterValidationError(errors));

    // 2. Sign up
    const newUser = await this.accountService.signUp(userData);

    ctx.body = newUser.toJSON();
  }

  /**
   * POST /account/signin
   *
   * @param ctx
   */
  @Post('/signin')
  async signIn(ctx: Context) {
    // 1. Validate data
    const { email, password } = ctx.request.body;
    assert(typeof email === 'string', ERROR.ParameterError('email'));
    assert(typeof password === 'string', ERROR.ParameterError('password'));

    // 2. Sign in
    const user = await this.accountService.signIn(email, password);
    ctx.body = user.toJSON();

    // 3. Save login state in session
    assert(ctx.session);
    ctx.session.user = user.toJSON({ withPassword: true, withLocation: true });
  }
}
