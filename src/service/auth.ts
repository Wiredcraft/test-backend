import assert, { equal } from 'assert';
import { stringify } from 'querystring';
import { ObjectID } from 'typeorm';
import { ClientMap } from '../../test/thridPartyApp';
import { ERROR } from '../config/constant';
import { ObjectId } from '../db/mongo';
import { Token } from '../entity/token';
import { User } from '../entity/user';
import { TokenModel } from '../model/token';
import { UserModel } from '../model/user';
import { Config, Inject, Provide } from '../util/container';
import { md5 } from '../util/crypto';
import { CacheService } from './cache';

export interface AuthConfig {
  requestTokenKey: string;
  accessTokenKey: string;
  saltKey: string;
  callbackTTL: number;
  tokenTTL: number;
}

interface AuthorizationParams {
  uid: string;
  redirectUri: string;
  clientId: string;
  timestamp: number;
  permissions?: string[];
}

interface AuthCbClientCache {
  uid: string;
  clientId: string;
  permissions?: string[];
}

interface AuthCbServerCache {
  clientId: string;
  permissions?: string[];
}

@Provide()
export class AuthService {
  @Config('auth')
  private config: AuthConfig;

  @Inject()
  private userModel: UserModel;

  @Inject()
  private tokenModel: TokenModel;

  @Inject()
  private cacheService: CacheService;

  /**
   * Get callback url
   *
   * Generate RequestToken for client, and assemble token in url.
   * Paired with #getDataFromRequestToken()
   * @param param0 Auth parameters
   * @returns url string
   */
  async getCallbackUrl({
    uid: id,
    clientId,
    timestamp,
    redirectUri,
    permissions
  }: AuthorizationParams) {
    // For test only, should be rewrite to rpc
    const client = ClientMap[clientId];
    assert(client, ERROR.SERVICE_AUTH_COMMON_CLIENTID_NOT_FOUND);

    // Generate request token
    const token = this.getRequestToken(clientId, timestamp);

    // Cache the auth info
    await Promise.all([
      // for client hold
      this.cacheService.set<AuthCbClientCache>(
        `auth-req-${token}`,
        {
          uid: id,
          clientId,
          permissions
        },
        this.config.callbackTTL
      ),
      // for server hold
      this.cacheService.set<AuthCbServerCache>(
        `auth-${id}`,
        { clientId, permissions },
        this.config.callbackTTL
      )
    ]);

    return `${client.callback}?${stringify({
      request_token: token,
      redirect_uri: redirectUri
    })}`;
  }

  /**
   * Get data by RequestToken
   *
   * Paired with #getCallbackUrl()
   * @param token request token
   * @returns
   */
  async getDataFromRequestToken(token: string) {
    // Get cache from client's token
    const clientCache = await this.cacheService.get<AuthCbClientCache>(
      `auth-req-${token}`
    );
    assert(clientCache, ERROR.SERVICE_AUTH_REQUESTTOKEN_CACHE_NOT_FOUND);

    // Get serverside cache of corresponding token
    const serverCache = await this.cacheService.get<AuthCbServerCache>(
      `auth-${clientCache.uid}`
    );
    assert(serverCache?.clientId),
      ERROR.SERVICE_AUTH_REQUESTTOKEN_CACHE_NOT_FOUND;

    // Check if the token come from normal flow
    equal(
      clientCache.clientId,
      serverCache.clientId,
      ERROR.SERVICE_AUTH_REQUESTTOKEN_UNEXPECTED_SOURCE
    );

    return { uid: clientCache.uid, clientId: clientCache.clientId };
  }

  /**
   * Issue a AccessToken
   *
   * Repeated issuing in a short time will get the same one
   * @param uid
   * @param clientId
   * @returns
   */
  async issueAccessToken(uid: string, clientId: string) {
    // Check if token exists
    const checkedToken = await this.tokenModel.getOneByUid(uid, clientId);
    if (checkedToken) {
      // return exist
      return { accessToken: checkedToken._id };
    }
    // Create token
    const token = await this.tokenModel.create(new Token(uid, clientId));
    return { accessToken: token._id };
  }

  /**
   * Issue a new AccessToken from the old one
   *
   * @param tid
   * @param clientId
   * @returns
   */
  async refreshAccessToken(tid: string | ObjectID, clientId: string) {
    // Check if the old one exists
    const [oldToken] = await this.tokenModel.get({
      where: { _id: ObjectId(tid) },
      take: 1
    });
    assert(oldToken, ERROR.SERVICE_AUTH_ACCESSTOKEN_NOT_FOUND);

    // Disable the old one
    const result = await this.tokenModel.disable(oldToken._id);
    equal(result.affected, 1, ERROR.COMMON_INTERVAL_SERVER_ERROR);

    // Create a new one from old
    const { _id } = await this.tokenModel.create(Token.from(oldToken));
    return { accessToken: _id };
  }

  /**
   * Get user data from AccessToken
   *
   * Paired with #issueAccessToken() / #refreshAccessToken()
   * @param accessToken token id
   * @returns
   */
  async getUserByAccessToken(
    accessToken: string | ObjectID
  ): Promise<User | null> {
    // Check if token valid
    const token = await this.tokenModel.getById(accessToken);
    assert(token, ERROR.SERVICE_AUTH_ACCESSTOKEN_NOT_FOUND);

    // Get user data by token
    const user = await this.userModel.getOneById(token.uid);
    assert(user, ERROR.MODEL_USER_GETONEBYID_USER_NOT_FOUND);

    return user;
  }

  getRequestToken(clientId: string, timestamp: number) {
    const text = `${this.config.saltKey}|${clientId}|${timestamp}`;
    return md5(text);
  }
}
