/**
 * README
 *
 * @description Thrid party application for test authentication/authorization.
 *
 * @H1 Simple AuthFlow
 *
 * A. user come to thridPartyApp (current file, alias currentServer)
 *    to see user's nearby list of test-backend (whole project)
 *    from user browser
 *      --> GET '/test-backend/user/nearby' @currentServer
 *        --> check accessToken
 *          --> no accessToken found (supposed to be first time in this flow)
 *          --> redirect to authServer
 * B. come to authServer authorization page
 *      --> GET 'http://localhost:3000/auth/authorizate' authServer
 *        --> check if user sign in
 *          --> if user offline
 *            --> let user sign in
 *          --> if user online, continue
 *            --> let user check the permission, then submit request
 * C. user submit authorization to authServer
 *      --> POST 'http://localhost:3000/auth/authorizate' authServer
 *        --> check bla bla
 *          --> if not good
 *            --> stop the flow
 *          --> if good
 *            --> generate request token
 *            --> from client info get callback url of @currentServer
 *            --> redirect callback
 * D. callback to currentServer
 *      --> GET '/test-backend/callback' @currentServer
 *        --> check bla bla
 *          --> if not good
 *            --> stop the flow
 *          --> if good
 *            --> request authServer to get accessToken
 *            --> POST 'http://localhost:3000/auth/token' authServer
 *              --> check bla bla
 *                --> if not good
 *                  --> stop the flow
 *                --> if good
 *                  --> generate and return accessToken
 *        --> save accessToken in session @currentServer
 * E. redirect to first step
 *      --> GET '/test-backend/user/nearby' @currentServer
 *        --> check accessToken
 *          --> found accessToken
 *          --> use accessToken to request
 *          --> GET 'http://localhost:3000/user/nearby' from resourceServer
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
 *  AuthFlow: 1(A) means 1st step of thridPartyApp within this flow (at A phase)
 *  AuthFlow: 5(D) means 5th step of thridPartyApp within this flow (at D phase)
 */
import Koa from 'koa';
import session from 'koa-session';
import Router from '@koa/router';
import axios from 'axios';
import { strict as assert } from 'assert';
import { auth } from '../src/config/config.default';
import { debuglog } from 'util';

const debug = debuglog('AUTH:3rdApp');

// For test only
const client = {
  id: '12345',
  name: 'Thrid-Party Application (Test)',
  callback: 'http://localhost:8080/test-backend/callback'
};
export const ClientMap: { [key: string]: typeof client } = {
  '12345': client
};

const authServerUrl = 'http://localhost:3000';
const resourceServerUrl = 'http://localhost:3000';

export const thridPartyApp = new Koa();

const router = new Router();

/**
 * AuthFlow: 1(A) user came here (3rd-party app)
 */
router.get('/test-backend/user/nearby', async (ctx) => {
  // AuthFlow: 2(A) check  access token
  const accessToken = ctx.session?.accessToken;
  if (!accessToken) {
    // AuthFlow: 3(A) no accessToken found
    const { href } = ctx;

    // AuthFlow: 4(A). redirect to test-backend
    ctx.redirect(
      authServerUrl +
        '/auth/authorizate?' +
        `&redirect_uri=${encodeURIComponent(href)}` +
        `&client_id=${client.id}`
    );
    return;
  }

  // AuthFlow: 10(E) use accessToken to request test-backend
  const resp = await axios.get(`${resourceServerUrl}/user/nearby`, {
    headers: {
      [auth.accessTokenKey]: accessToken
    }
  });

  ctx.status = resp.status;
  ctx.body = resp.data;
});

/**
 * AuthFlow: 5(D) callback from test-backend
 */
router.get('/test-backend/callback', async (ctx) => {
  // AuthFlow: 6(D) Check if request invalid
  const { request_token: requestToken, redirect_uri: redirectUri } = ctx.query;
  assert(typeof requestToken === 'string');
  assert(typeof redirectUri === 'string');
  assert(ctx.get('referer').startsWith(authServerUrl));

  // AuthFlow: 7(D) request test-backend to get accessToken
  const resp = await axios.post(
    `${authServerUrl}/auth/token`,
    {},
    {
      headers: {
        [auth.requestTokenKey]: requestToken
      }
    }
  );
  debug(resp?.status.toString());
  debug(JSON.stringify(resp?.data));
  const accessToken = resp?.data?.accessToken;

  // AuthFlow: 8(D) save accessToken in session
  assert(ctx.session);
  ctx.session.accessToken = accessToken;

  // AuthFlow: 9(D) redirect to the beginning
  ctx.redirect(redirectUri);
});

thridPartyApp.keys = ['some secret'];
thridPartyApp
  .use(session({ secure: false }, thridPartyApp))
  .use(router.routes())
  .use(router.allowedMethods());

if (process.env.FROM_CLI) {
  thridPartyApp.listen(8080, () => debug('started'));
}
