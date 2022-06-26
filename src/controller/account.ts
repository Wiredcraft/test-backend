/**
 * # Account Controller
 *
 * The controller for account operation, such as sign in and sign up.
 *
 * ## Injected Dependency
 *
 * - [AccountService](../modules/service_account.html)
 * - [ViewService](../modules/service_view.html)
 *
 * ## APIs
 *
 * | Method | Path             | Link
 * |--------|------------------|--------------------------
 * | GET    | /account/signin  | [Doc](../classes/controller_account.AccountController.html#signInPage)
 * | POST   | /account/signin  | [Doc](../classes/controller_account.AccountController.html#signIn)
 * | GET    | /account/signup  | [Doc](../classes/controller_account.AccountController.html#signUpPage)
 * | POST   | /account/signup  | [Doc](../classes/controller_account.AccountController.html#signUp)
 *
 * See [index](./controller.html) for more controllers.
 *
 * @module
 */
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
   * # GET /account/signup
   *
   * ## Parameters
   *
   * | Name         | Type   | Located | Required | Example             | Description
   * |--------------|--------|---------|----------|---------------------|-----
   * | redirect_uri | String | Query   | No       | `%2Faccount%2Fsignin` | encoded url
   * | orgin_query  | String | Query   | No       | `%3Fredirect_uri%3D%252Fauth%252Fauthorizate%...` | encoded url
   *
   * ## Returns
   *
   * html page with form, rendered by [view/signup.ejs](https://github.com/Lellansin/test-backend/blob/master/src/view/signup.ejs).
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode | ErrorMessage | Description
   * |----------------|-----------|--------------|-------------
   * | 400            | 10000     | `invalid paramter: 'redirect_uri'` |
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Get('/signup')
  async signUpPage(ctx: Context) {
    ctx.body = await this.viewService.render('signup', {
      querystring: this.getRedirectQueryString(ctx)
    });
  }

  /**
   * # POST /account/signup
   *
   * ## Parameters
   *
   * | Name      | Type       | Located | Required | Example             | Description
   * |-----------|------------|---------|----------|---------------------|-----
   * | email     | String     | Body    | Yes      | `"name@domain.com"` |
   * | password  | String     | Body    | Yes      | `"123456"`
   * | name      | String     | Body    | Yes      | `"Allansin"`
   * | dob       | Number     | Body    | No       | `"1656172886000"`
   * | address   | String     | Body    | No       | `"Capital of Mars"`
   * |description| String     | Body    | No       | `"Someone boring"`
   * | location  | [Num, Num] | Body    | No       | `[120.21201, 30.2084]`
   *
   * ## Returns
   *
   * StatusCode 201 with empty body.
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode          | ErrorMessage | Description
   * |----------------|--------------------|--------------|-------------
   * | 400            | 10001              | `paramter validation failed: 'xxx must be ...'` |
   * | 409            | 12002              | `Registered email conflict` |
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
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
   * # GET /account/signin
   *
   * Server side render page for user to sign in.
   *
   * ## Parameters
   *
   * | Name         | Type   | Located | Required | Example             | Description
   * |--------------|--------|---------|----------|---------------------|-----
   * | redirect_uri | String | Query   | No       | `%2Faccount%2Fsignin` | encoded url
   * | orgin_query  | String | Query   | No       | `%3Fredirect_uri%3D%252Fauth%252Fauthorizate%...` | encoded url
   *
   * ## Returns
   *
   * html page with form, rendered by [view/signin.ejs](https://github.com/Lellansin/test-backend/blob/master/src/view/signin.ejs).
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode                    | ErrorMessage | Description
   * |----------------|------------------------------|--------------|-------------
   * | 400            | 10000                        | `invalid paramter: 'redirect_uri'` |
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Get('/signin')
  async signInPage(ctx: Context) {
    ctx.body = await this.viewService.render('signin', {
      querystring: this.getRedirectQueryString(ctx)
    });
  }

  /**
   * # POST /account/signin
   *
   * User sign with account email and password.
   *
   * ## Parameters
   *
   * | Name     | Type   | Located | Required | Example             | Description
   * |----------|--------|---------|----------|---------------------|-----
   * | email    | String | Body    | Yes      | `"name@domain.com"` |
   * | password | String | Body    | Yes      | `"123456"`
   *
   * ## Returns
   *
   * [\<User\>](../modules/entity_user.html) object.
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode   | ErrorMessage | Description
   * |----------------|-------------|--------------|-------------
   * | 400            | 10000       | `invalid paramter: '${name}'` |
   * | 404            | 12000       | `Email not found` |
   * | 403            | 12001       | `invalid password` |
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
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
   * ### Get redirect info
   *
   * 3rd party app redirect to current auth page with redirect info A.
   * If user authorizated, page should redirect by A.
   *
   * But, usually user need to redirect to sign page before redirect to A.
   * Hence, there is redirecion B from auth page to sign page.
   *
   * Even if user not signed up, user need to redirect to sign up page from sign in page.
   * So, when user redirect to sign up, there is redirection C.
   *
   * This redirection chain above looks like:
   *
   * ```
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
   * ```
   *
   * ## Class Method
   * @returns querystring
   */
  private getRedirectQueryString(ctx: Context) {
    const { redirect_uri: redirectUri, orgin_query: orgQuery } = ctx.query;
    let querystring = '?';

    // Save current redirection path (current path come from frontend, see *.ejs for more)
    if (redirectUri) {
      assert(
        typeof redirectUri === 'string',
        ERROR.ParameterError('redirect_uri')
      );
      querystring += 'redirect_uri=' + encodeURIComponent(redirectUri);
    }

    // Wrap last url (include last rediction)
    if (redirectUri && orgQuery) {
      assert(typeof orgQuery === 'string', ERROR.ParameterError('orgin_query'));
      querystring += '&orgin_query=' + encodeURIComponent(orgQuery);
    }

    return querystring;
  }
}
