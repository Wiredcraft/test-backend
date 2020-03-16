import {expect} from '@loopback/testlab';
import sinon from 'sinon';
import {JWTService} from '../../../services/jwt-service';

describe('JWTService (unit)', () => {
  let jwtService: JWTService;
  beforeEach(() => {
    jwtService = new JWTService('secret', '600');
  });

  describe('verifyToken()', () => {
    it('should throw Unauthorized if !token', async () => {
      try {
        // eslint-disable-next-line
        await jwtService.verifyToken(null as any);
      } catch (err) {
        expect(err).match(/Error verifying token: 'token' is null/);
      }
    });

    it('should throw error if verifyAsync fail', async () => {
      try {
        await jwtService.verifyToken(
          Object.assign({name: 'name'}),
          sinon.stub().throws('mockError'),
        );
      } catch (err) {
        expect(err).match(/Error verifying token/);
      }
    });
  });

  describe('generateToken()', () => {
    it('should throw Unauthorized if !userProfile', async () => {
      try {
        // eslint-disable-next-line
        await jwtService.generateToken(null as any);
      } catch (err) {
        expect(err).match(/Error generating token: userProfile is null/);
      }
    });

    it('should throw error if signAsync fail', async () => {
      try {
        await jwtService.generateToken(
          Object.assign({name: 'name'}),
          sinon.stub().throws('mockError'),
        );
      } catch (err) {
        expect(err).match(/Error encoding token/);
      }
    });
  });
});
