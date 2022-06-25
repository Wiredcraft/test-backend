/**
 * README
 *
 * @description Auth serverside endpoints implements
 *
 * @H1 Simple AuthFlow
 *
 * A. user come to thridPartyApp (for test)
 *    to see user's nearby list of test-backend (current project, alias currentServer)
 *    from user browser
 *      --> GET '/test-backend/user/nearby' thridPartyApp
 *        --> check accessToken
 *          --> no accessToken found (supposed to be first time in this flow)
 *          --> redirect to currentServer
 * B. come to currentServer's authorization page
 *      --> GET 'http://localhost:3000/auth/authorizate' @currentServer
 *        --> check if user sign in
 *          --> if user offline
 *            --> let user sign in
 *          --> if user online, continue
 *            --> let user check the permission, then submit request
 * C. user submit authorization to currentServer
 *      --> POST 'http://localhost:3000/auth/authorizate' @currentServer
 *        --> check bla bla
 *          --> if not good
 *            --> stop the flow
 *          --> if good
 *            --> generate request token
 *            --> from client info get callback url of thridPartyApp
 *            --> redirect callback
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
 *
 * @H1 Step Guide
 *
 * Number(Char)
 *
 * Number means step from @currentServer
 * Char   means phase of entire auth flow
 *
 * @Examples
 *  1(B) means 1st step of currentServer within this flow (at B phase)
 *  5(D) means 5th step of currentServer within this flow (at D phase)
 */
import {
  strict as assert,
  strictEqual as equal,
  deepStrictEqual as deepEqual
} from 'assert';
import Koa from 'koa';
import { ClientMap } from '../../test/thridPartyApp';
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
   * GET /auth/authorizate
   *
   * AuthFlow: 1(B) show authorization page, let user confirm to authorizate
   */
  @Get('/authorizate')
  async renderPage(ctx: Context) {
    // Check parameters
    const { client_id: clientId, redirect_uri: redirectUri } = ctx.query;
    assert(typeof clientId === 'string');
    assert(typeof redirectUri === 'string');
    const client = ClientMap[clientId];
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
   * POST /auth/authorizate
   *
   * AuthFlow: 2(C) user submit authorization
   */
  @Post('/authorizate')
  @Guard(LoginRedirect)
  async authorizate(ctx: Context) {
    const auth = ctx.session.auth;
    assert(auth);

    // 3(C) Check if request valid
    const { permissions, redirectUri, clientId } = ctx.request.body;
    const timestamp = Number(ctx.request.body.timestamp);
    equal(auth.redirectUri, redirectUri);
    equal(auth.clientId, clientId);
    equal(auth.timestamp, timestamp);

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
   * POST /auth/token
   *
   * AuthFlow: 6(D) Client request for accessToken
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
   * PATCH /auth/token
   */
  @Patch('/token')
  async refreshToken(ctx: Context) {
    // Check parameters
    const { accessToken, clientId, permissions } = ctx.request.body;
    assert(typeof accessToken === 'string');
    assert(typeof clientId === 'string');
    assert(Array.isArray(permissions));

    ctx.body = await this.authService.refreshAccessToken(
      accessToken,
      clientId,
      permissions
    );
  }
}
