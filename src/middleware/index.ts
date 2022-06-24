import { BodyParser } from './bodyParser';
import { Session } from './session';

// middlewares in order
export const MiddlewareClasses = [BodyParser, Session];
