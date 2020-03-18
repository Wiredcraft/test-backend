import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {profile} from '../../../interceptors';

describe('ProfileInterceptor (unit)', () => {
  let logStub: sinon.SinonStub;

  beforeEach(() => {
    logStub = sinon.stub();
    // eslint-disable-next-line
    (console.log as any) = logStub;
  });

  it('should print the time of the api call', async () => {
    // eslint-disable-next-line
    const ctx = {methodName: 'test'} as any;
    await profile(ctx, async () => new Promise(res => setTimeout(res, 1)));
    expect(logStub.calledTwice).to.be.true();
  });
});
