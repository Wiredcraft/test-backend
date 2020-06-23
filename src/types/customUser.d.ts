import { UserInterface } from '../models/user';

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserInterface & { id: string };
  }
  interface Response {
    user?: UserInterface & { id: string };
  }
}
