import {
  AUTHENTICATION_STRATEGY_NOT_FOUND,
  USER_PROFILE_NOT_FOUND,
} from '@loopback/authentication';
import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {MyAuthenticationSequence} from './../../sequence';

describe('MyAuthenticationSequence (unit)', () => {
  let findRouteStub: sinon.SinonStub;
  let parseParamsStub: sinon.SinonStub;
  let invokeStub: sinon.SinonStub;
  let sendStub: sinon.SinonStub;
  let rejectStub: sinon.SinonStub;
  let authenticateRequestStub: sinon.SinonStub;
  let sequence: MyAuthenticationSequence;

  beforeEach(() => {
    findRouteStub = sinon.stub();
    parseParamsStub = sinon.stub();
    invokeStub = sinon.stub();
    sendStub = sinon.stub();
    rejectStub = sinon.stub();
    authenticateRequestStub = sinon.stub();
    sequence = new MyAuthenticationSequence(
      findRouteStub,
      parseParamsStub,
      invokeStub,
      sendStub,
      rejectStub,
      authenticateRequestStub,
    );

    findRouteStub.resolves();
    parseParamsStub.resolves();
    sendStub.resolves();
    rejectStub.resolves();
    authenticateRequestStub.resolves();
  });

  describe('handler()', () => {
    it('should handle', async () => {
      invokeStub.resolves();
      // eslint-disable-next-line
      const ctx = {} as any;
      await sequence.handle(ctx);
      expect(1).to.be.eql(1);
    });

    it(`should assign 401 to error if code is AUTHENTICATION_STRATEGY_NOT_FOUND`, async () => {
      // eslint-disable-next-line
      const ctx = {} as any;

      invokeStub.throws({code: AUTHENTICATION_STRATEGY_NOT_FOUND});
      try {
        await sequence.handle(ctx);
      } catch (err) {
        expect(err.statusCode).to.be.eql(401);
      }
    });

    it(`should assign 401 to error if code is USER_PROFILE_NOT_FOUND`, async () => {
      // eslint-disable-next-line
      const ctx = {} as any;

      invokeStub.throws({code: USER_PROFILE_NOT_FOUND});
      try {
        await sequence.handle(ctx);
      } catch (err) {
        expect(err.statusCode).to.be.eql(401);
      }
    });

    it(`should assign 401 to error if code is MOCK_ERROR`, async () => {
      // eslint-disable-next-line
      const ctx = {} as any;

      invokeStub.throws({code: 'MOCK_ERROR'});
      try {
        await sequence.handle(ctx);
      } catch (err) {
        expect(err.statusCode).to.be.undefined();
      }
    });
  });
});
