import { BodyParser } from './bodyParser';
import { OnError } from './onerror';
import { Session } from './session';
import { AuthController } from '../controller/auth';

// middlewares in order
export const MiddlewareClasses = [OnError, BodyParser, Session, AuthController];
