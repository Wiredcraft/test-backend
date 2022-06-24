import { BodyParser } from './bodyParser';
import { OnError } from './onerror';
import { Session } from './session';

// middlewares in order
export const MiddlewareClasses = [OnError, BodyParser, Session];
