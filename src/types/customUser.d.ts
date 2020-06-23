import { UserInterface } from '../models/user';

export type RequestUser = UserInterface & { id: string };
declare module 'express-serve-static-core' {
  interface Request {
    user?: RequestUser;
  }
  interface Response {
    user?: RequestUser;
  }
}
