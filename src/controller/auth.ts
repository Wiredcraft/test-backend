/**
 * # Auth Controller
 *
 * Auth serverside endpoints implements
 *
 * ## Injected Dependency
 *
 * - [AuthService](../modules/service_auth.html)
 * - [ViewService](../modules/service_view.html)
 *
 * ## APIs
 *
 * | Method | Path             | Link
 * |--------|------------------|--------------------------
 * | GET    | /auth/authorizate | [Doc](../classes/controller_auth.AuthController.html#renderPage)
 * | POST   | /auth/authorizate | [Doc](../classes/controller_auth.AuthController.html#authorizate)
 * | POST   | /auth/token       | [Doc](../classes/controller_auth.AuthController.html#accessToken)
 * | PATCH  | /auth/token       | [Doc](../classes/controller_auth.AuthController.html#refreshToken)
 * | POST   | /auth/client      | [Doc](../classes/controller_auth.AuthController.html#createClient)
 *
 * Check [index](./controller.html) for more controllers.
 *
 * ## Middleware
 *
 * | Scope  | Name         | Link
 * |--------|--------------|--------------------------
 * | Global | authenticate | [method](../classes/controller_auth.AuthController.html#authenticate)
 *
 * Check [index](../modules/middleware.html) for more middleware.
 *
 * ## Simple AuthFlow
 *
 * Before this flow starts, thridPartyApp should have got the client id
 * through [/POST /auth/client](../classes/controller_auth.AuthController.html#createClient).
 *
 * ### Phase A
 *
 * ```
 * A. user come to thridPartyApp (for test)
 *    to see user's nearby list of test-backend (current project, alias currentServer)
 *    from user browser
 *      --> GET '/test-backend/user/nearby' thridPartyApp
 *        --> check accessToken
 *          --> no accessToken found (supposed to be first time in this flow)
 *          --> redirect to currentServer
 * ```
 *
 * ### Phase B
 *
 * ```
 * B. come to currentServer's authorization page
 *      --> GET 'http://localhost:3000/auth/authorizate' @currentServer
 *        --> check if user sign in
 *          --> if user offline
 *            --> let user sign in
 *          --> if user online, continue
 *            --> let user check the permission, then submit request
 * ```
 *
 * ### Phase C
 *
 * ```
 * C. user submit authorization to currentServer
 *      --> POST 'http://localhost:3000/auth/authorizate' @currentServer
 *        --> check bla bla
 *          --> if not good
 *            --> stop the flow
 *          --> if good
 *            --> generate request token
 *            --> from client info get callback url of thridPartyApp
 *            --> redirect callback
 * ```
 *
 * ### Phase D
 *
 * ```
 * D. callback to thridPartyApp
 *      --> GET '/test-backend/callback' thridPartyApp
 *        --> check bla bla
 *          --> if not good
 *            --> stop the flow
 *          --> if good
 *            --> request currentServer to get accessToken
 *            --> POST 'http://localhost:3000/auth/token' @currentServer
 *              --> check bla bla
 *                --> if not good
 *                  --> stop the flow
 *                --> if good
 *                  --> generate and return accessToken
 *        --> save accessToken in session thridPartyApp
 * ```
 *
 * ### Phase E
 *
 * ```
 * E. redirect to first step
 *      --> GET '/test-backend/user/nearby' thridPartyApp
 *        --> check accessToken
 *          --> found accessToken
 *          --> use accessToken to request
 *          --> GET 'http://localhost:3000/user/nearby' from @currentServer
 *            --> check accessToken in middleware
 *              --> if good
 *                --> save user info in session
 *            --> return results
 *          --> return results from resourceServer
 *```
 *
 * ## Comment Guide
 *
 * `AuthFlow: $Number($Char)`
 *
 * - $Number means step from @currentServer
 * - $Char   means phase of entire auth flow
 *
 * ### Examples
 *
 * - 1(B) means 1st step of currentServer within this flow (at B phase).
 * - 5(D) means 5th step of currentServer within this flow (at D phase).
 *
 * @module
 */
import { strict as assert, strictEqual as equal } from 'assert';
import Koa from 'koa';
import { ERROR } from '../config/constant';
import { Context } from '../interface';
import { LoginRedirect } from '../middleware/loginRedirect';
import { AuthConfig, AuthService } from '../service/auth';
import { ViewService } from '../service/view';
import { Config, Inject, Provide } from '../util/container';
import { Controller, Get, Guard, Middleware, Patch, Post } from '../util/web';

@Provide()
@Controller('/auth')
export class AuthController {
  @Inject()
  viewService: ViewService;

  @Inject()
  authService: AuthService;

  @Config('auth')
  config: AuthConfig;

  /**
   * # POST /auth/client
   *
   * Thrid party app register client
   *
   * ## Parameters
   *
   * | Name        | Type     | Located | Required | Example             | Description
   * |-------------|----------|---------|----------|---------------------|-----
   * | name        | String   | Body    | Yes      | `Github` | encoded url
   * | callbackUrl | String   | Body    | Yes      | `http://localhost:8080/test-backend/callback` |
   *
   * ## Returns
   *
   * StatusCode 200 with JSON formed [\<Client\>](../modules/entity_client.html)
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
  @Post('/client')
  @Guard(LoginRedirect)
  async createClient(ctx: Context) {
    const user = ctx.session.user;
    assert(user);

    // Check parameters
    const { name, callbackUrl } = ctx.request.body;
    assert(typeof name === 'string', ERROR.ParameterError('name'));
    assert(
      typeof callbackUrl === 'string',
      ERROR.ParameterError('callbackUrl')
    );

    // Generate client and return
    ctx.body = await this.authService.createClient(user.id, name, callbackUrl);
  }

  /**
   * # GET /auth/authorizate
   *
   * AuthFlow: 1([B](../modules/controller_auth.html#phase-b)) show authorization page, let user confirm to authorizate
   *
   * ## Parameters
   *
   * | Name         | Type   | Located | Required | Example             | Description
   * |--------------|--------|---------|----------|---------------------|-----
   * | redirect_uri | String | Query   | Yes      | `http%3A%2F%2Flocalhost%3A8080%2Ftest-backend%2Fuser%2Fnearby` | encoded url
   * | client_id    | String | Query   | Yes      | `'12345'`
   *
   * ## Returns
   *
   * html page, rendered by [view/auth.ejs](https://github.com/Lellansin/test-backend/blob/master/src/view/auth.ejs).
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode | ErrorMessage | Description
   * |----------------|-----------|--------------|-------------
   * | 400            | 10000     | `invalid paramter: '${name}'` |
   * | 400            | 12300     | `Auth client id not found, ...` |
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Get('/authorizate')
  async renderPage(ctx: Context) {
    // Check parameters
    const { client_id: clientId, redirect_uri: redirectUri } = ctx.query;
    assert(typeof clientId === 'string', ERROR.ParameterError('client_id'));
    assert(
      typeof redirectUri === 'string',
      ERROR.ParameterError('redirect_uri')
    );
    const client = await this.authService.getClient(clientId);
    assert(client, ERROR.SERVICE_AUTH_COMMON_CLIENTID_NOT_FOUND);

    // Save session for check later
    const timestamp = Date.now();
    ctx.session.auth = {
      clientId,
      redirectUri,
      reffer: ctx.get('reffer'),
      timestamp
    };

    // Render with check items in GET  /auth/authorizate
    //   items will be checked in POST /auth/authorizate
    ctx.body = await this.viewService.render('auth', {
      from: client.name,
      user: ctx.session.user,
      clientId,
      redirectUri,
      timestamp
    });
  }

  /**
   * # POST /auth/authorizate
   *
   * AuthFlow: 2([C](../modules/controller_auth.html#phase-c)) user submit authorization
   *
   * ## Parameters
   *
   * | Name        | Type     | Located | Required | Example             | Description
   * |-------------|----------|---------|----------|---------------------|-----
   * | redirectUri | String   | Body    | Yes      | `%2Faccount%2Fsignin...` | encoded url
   * | clientId    | String   | Body    | Yes      | `12345` |
   * | permissions | String[] | Body    | Yes      | `['email', 'name']`
   *
   * ## Returns
   *
   * StatusCode 302 with location header.
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode | ErrorMessage | Description
   * |----------------|-----------|--------------|-------------
   * | 400            | 10000     | `invalid paramter: 'redirect_uri'` |
   * | 404            | 12300     | `Auth client id not found, ...` |
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Post('/authorizate')
  @Guard(LoginRedirect)
  async authorizate(ctx: Context) {
    const auth = ctx.session.auth;
    assert(auth);

    // 3(C) Check if request valid
    const { permissions, redirectUri, clientId } = ctx.request.body;
    const timestamp = Number(ctx.request.body.timestamp);
    equal(auth.redirectUri, redirectUri, ERROR.ParameterError('redirectUri'));
    equal(auth.clientId, clientId, ERROR.ParameterError('clientId'));
    equal(auth.timestamp, timestamp, ERROR.ParameterError('timestamp'));

    // 4(C) Generate callback with validation token
    const { id } = ctx.session.user;
    const url = await this.authService.getCallbackUrl({
      uid: id,
      redirectUri,
      clientId,
      timestamp,
      permissions
    });

    // 5(C) Redirect to client callback
    ctx.redirect(url);
  }

  /**
   * # POST /auth/token
   *
   * AuthFlow: 6([D](../modules/controller_auth.html#phase-d)) Client request for accessToken

   * ## Parameters
   * 
   * | Name                 | Type   | Located | Required | Example             | Description 
   * |----------------------|--------|---------|----------|---------------------|-----
   * | x-auth-request-token | String | Header  | Yes      | `'62b7514a7d1dbf71da4c5647'` 
   * 
   * ## Returns
   * 
   * ```typescript
   * interface JsonBody {
   *   accessToken: string;
   * }
   * ```
   * 
   * ## Error Codes
   * 
   * | HttpStatusCode | ErrorCode | ErrorMessage | Description 
   * |----------------|-----------|--------------|-------------
   * | 400            | 10000     | `invalid paramter: 'redirect_uri'` |
   * | 404            | 12301     | `Auth client id not found, ...` |
   * | 403            | 12302     | `Unexpected source of token` |
   * 
   * Check [ErrorCode](../modules/constants.html) table for more.
   * 
   * ## Class Method
   */
  @Post('/token')
  async accessToken(ctx: Context) {
    // 7(D) Check if token is good
    const token = ctx.get(this.config.requestTokenKey);
    assert(token, ERROR.ParameterError(this.config.requestTokenKey));
    const { uid, clientId, permissions } =
      await this.authService.getDataByRequestToken(token);

    // 8(D) Issue accessToken
    const data = await this.authService.issueAccessToken(
      uid,
      clientId,
      permissions
    );

    // 9(D) Response token to client
    ctx.body = data;
  }

  /**
   * 10(E) Global middleware for AccessToken authentication
   * @returns
   */
  @Middleware()
  authenticate(): Koa.Middleware {
    return async (ctx, next) => {
      const session = ctx.session;
      const token = ctx.get(this.config.accessTokenKey);
      // If user not signed in and thre is AccessToken
      if (session && !session.user && token.length && ctx.session) {
        // 12(E) Get user data by AccessToken
        const user = await this.authService.getUserByAccessToken(token);
        session.user = user.toJSON({
          withLocation: true,
          withPassword: true
        });
      }
      return next();
    };
  }

  /**
   * # PATCH /auth/token
   *
   * refresh AccessToken
   *
   * ## Parameters
   *
   * | Name        | Type     | Located | Required | Example             | Description
   * |-------------|----------|---------|----------|---------------------|-----
   * | redirectUri | String   | Body    | Yes      | `%2Faccount%2Fsignin...` | encoded url
   * | clientId    | String   | Body    | Yes      | `12345` |
   * | permissions | String[] | Body    | Yes      | `['email', 'name']`
   *
   * ## Returns
   *
   * ```typescript
   * interface JsonBody {
   *   accessToken: string;
   * }
   * ```
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode | ErrorMessage | Description
   * |----------------|-----------|--------------|-------------
   * | 400            | 10000     | `invalid paramter: 'redirect_uri'` |
   * | 404            | 12303     | `AccessToken is invalid or out of date` |
   * | 403            | 12302     | `AccessToken is invalid or out of date` |
   * | 500            | 1002      | `Interval server error` | DB write failed
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Patch('/token')
  async refreshToken(ctx: Context) {
    // Check parameters
    const { accessToken, clientId, permissions } = ctx.request.body;
    assert(
      typeof accessToken === 'string',
      ERROR.ParameterError('accessToken')
    );
    assert(typeof clientId === 'string', ERROR.ParameterError('client_id'));
    assert(Array.isArray(permissions), ERROR.ParameterError('permissions'));

    ctx.body = await this.authService.refreshAccessToken(
      accessToken,
      clientId,
      permissions
    );
  }
}
