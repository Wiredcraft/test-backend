/**
 * # Middleware Index
 *
 * Export middleware classes for [Application](./Application) to load.
 *
 * ## Class List
 *
 * - [onerror](../modules/middleware_onerror.html)
 * - [bodyParser](../modules/middleware_bodyParser.html)
 * - [session](../modules/middleware_session.html)
 * - [loginRedirect](../modules/middleware_loginRedirect.html)
 * - [stat](../modules/middleware_stat.html)
 * - [AuthController](../modules/controller_auth.html)
 *
 * ### Global
 *
 * Middleware loads for global scope in order:
 *
 * - [onerror](../modules/middleware_onerror.html)
 * - [bodyParser](../modules/middleware_bodyParser.html)
 * - [session](../modules/middleware_session.html)
 * - [AuthController](../modules/controller_auth.html)
 *
 * ### Local
 *
 * Middleware loads for local scope by special routers (defined in [controllers](./controller.html)):
 *
 * - [loginRedirect](../modules/middleware_loginRedirect.html)
 * - [stat](../modules/middleware_stat.html)
 *
 *
 * ## Middleware Class Declaration
 *
 * Each middleware class is declarated by the decorators:
 *
 * - @Middlware(): The controller declaration.
 * - @Guard(class): Declare `class` as the local middlware for the router decorated.
 *
 * The middleware class is the class which have one @Middleware decorated member.
 *
 * For example, the [AuthController](../modules/controller_auth.html) class
 * have @Middleware decorated member ([#authenticate](../classes/controller_auth.AuthController.html#authenticate)), so it is a middleware class.
 *
 * Check [Web Decorators](../modules/util_web.html) for more decorators.
 *
 * @module
 */
import { BodyParser } from './bodyParser';
import { OnError } from './onerror';
import { Session } from './session';
import { AuthController } from '../controller/auth';

// middlewares in order
export const MiddlewareClasses = [OnError, BodyParser, Session, AuthController];
