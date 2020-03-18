import {TokenService} from '@loopback/authentication';
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {JWTAuthenticationStrategy} from './../../../strategies/jwt-strategy';

describe('JWTAuthenticationStrategy (unit)', () => {
  let jwtAuthenticationStrategy: JWTAuthenticationStrategy;
  let tokenService: TokenService;
  let verifyTokenStub: sinon.SinonStub;

  beforeEach(() => {
    verifyTokenStub = sinon.stub();
    tokenService = {
      verifyToken: verifyTokenStub,
      generateToken: sinon.stub(),
    };
    jwtAuthenticationStrategy = new JWTAuthenticationStrategy(tokenService);
  });

  describe('extractCredentials()', () => {
    it('should throw error if omit authorization header', () => {
      // eslint-disable-next-line
      const request = {headers: {}} as any;
      try {
        jwtAuthenticationStrategy.extractCredentials(request);
      } catch (err) {
        expect(err).match(/Authorization header not found/);
      }
    });

    it(`should throw error if authorization header is not start with 'Bearer'`, () => {
      // eslint-disable-next-line
      const request = {headers: {authorization: 'token'}} as any;
      try {
        jwtAuthenticationStrategy.extractCredentials(request);
      } catch (err) {
        expect(err).match(/Authorization header is not of type 'Bearer'/);
      }
    });

    it(`should throw error if authorization header is more than two parts`, () => {
      // eslint-disable-next-line
      const request = {headers: {authorization: 'Bearer token x'}} as any;
      try {
        jwtAuthenticationStrategy.extractCredentials(request);
      } catch (err) {
        expect(err).match(/Authorization header has too many parts/);
      }
    });

    it('should  extract credentials', () => {
      // eslint-disable-next-line
      const request = {headers: {authorization: 'Bearer token'}} as any;
      const token = jwtAuthenticationStrategy.extractCredentials(request);
      expect(token).to.be.eql('token');
    });
  });
});
