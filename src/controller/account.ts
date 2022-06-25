import assert from 'assert';
import { Context } from 'koa';
import { validate } from 'class-validator';
import { User } from '../entity/user';
import { AccountService } from '../service/account';
import { Inject, Provide } from '../util/container';
import { Controller, Get, Post } from '../util/web';
import { ERROR } from '../config/constant';
import { ViewService } from '../service/view';

@Provide()
@Controller('/account')
export class AccountController {
  @Inject()
  accountService: AccountService;

  @Inject()
  viewService: ViewService;

  /**
   * GET /account/signup
   *
   * @param ctx
   */
  @Get('/signup')
  async signUpPage(ctx: Context) {
    ctx.body = await this.viewService.render('signup', {
      querystring: this.getRedirectQueryString(ctx)
    });
  }

  /**
   * POST /account/signup
   *
   * @param ctx
   */
  @Post('/signup')
  async signUp(ctx: Context) {
    // should send validation code
    // to check if is roboot in production

    // 1. validate the user data
    const userData = User.fromJSON(ctx.request.body);
    const errors = await validate(userData);
    assert(errors.length === 0, ERROR.ParameterValidationError(errors));

    // 2. Sign up
    await this.accountService.signUp(userData);

    // 3. Deal with redirection
    const { redirect_uri: redirectUri, orgin_query: orgQuery } = ctx.query;

    // If there is need
    if (redirectUri && orgQuery) {
      assert(typeof redirectUri === 'string');
      assert(typeof orgQuery === 'string');
      // redirect to orgin
      ctx.redirect(decodeURIComponent(redirectUri) + orgQuery);
    } else {
      // else return 201
      ctx.status = 201;
    }
  }

  /**
   * GET /account/signin
   *
   * @param ctx
   */
  @Get('/signin')
  async signInPage(ctx: Context) {
    ctx.body = await this.viewService.render('signin', {
      querystring: this.getRedirectQueryString(ctx)
    });
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

    // 3. Save login state in session
    assert(ctx.session);
    ctx.session.user = user.toJSON({ withPassword: true, withLocation: true });

    // 4. Deal with redirection
    const { redirect_uri: redirectUri, orgin_query: orgQuery } = ctx.query;

    // If there is need
    if (redirectUri && orgQuery) {
      assert(typeof redirectUri === 'string');
      assert(typeof orgQuery === 'string');
      // redirect to orgin
      ctx.redirect(
        decodeURIComponent(redirectUri) + decodeURIComponent(orgQuery)
      );
    } else {
      // else return 200
      ctx.body = user.toJSON();
    }
  }

  /**
   * Get redirect info
   *
   * 3rd party app redirect to current auth page with redirect info A
   * if user authorizated, page should redirect by A
   * but, usually user need to redirect to sign page before redirect to A
   * hence, there is redirecion B from auth page to sign page
   * event if user not signed up, user need to redirect to sign up page from sign in page
   * so, when user redirect to sign up, there is redirection C
   * this redirection chain above looks like:
   *
   * 3rd-party
   *    --> Redirction A
   *      --> auth page
   *        --> Redirction B
   *          --> sign in page
   *            --> Redirction C
   *              --> sign up page
   *              <-- sign up ok
   *            <-- Redirct C
   *          <-- sign in ok
   *        <-- Redirct B
   *      <-- auth ok
   *    <-- Redirct A
   * 3rd-party
   *
   * @returns querystring
   */
  private getRedirectQueryString(ctx: Context) {
    const { redirect_uri: redirectUri, orgin_query: orgQuery } = ctx.query;
    let querystring = '?';

    // Save current redirection path (current path come from frontend, see *.ejs for more)
    if (redirectUri) {
      assert(typeof redirectUri === 'string');
      querystring += 'redirect_uri=' + encodeURIComponent(redirectUri);
    }

    // Wrap last url (include last rediction)
    if (redirectUri && orgQuery) {
      assert(typeof orgQuery === 'string');
      querystring += '&orgin_query=' + encodeURIComponent(orgQuery);
    }

    return querystring;
  }
}
