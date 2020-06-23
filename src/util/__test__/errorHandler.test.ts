import { errorHandler } from '../errorHandler';

describe('errorHandler', () => {
  describe('normal function', () => {
    it('should be able to catch the error', async () => {
      expect(
        errorHandler(() => {
          throw Error('something went wrong');
        })
      ).not.toThrow();
    });
  });

  describe('express function', () => {
    it('should call res function and send 500 code', async () => {
      const mockReq = jest.fn();
      const mockJson = jest.fn();
      const mockRes = {
        status: jest.fn().mockImplementation(() => ({ json: mockJson })),
        constructor: { name: 'ServerResponse' },
      };
      errorHandler((req: Request, res: Response) => {
        throw Error('something went wrong');
      })(mockReq, mockRes);
      expect(mockRes.status).toBeCalledWith(500);
      expect(mockJson).toBeCalled();
    });
  });
});
