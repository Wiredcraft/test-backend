/**
 * # Controller Index
 *
 * Export controller classes for [Application](./Application) to load.
 *
 * ## Class List
 *
 * - [AccountController](./controller_account.html)
 * - [AuthController](./controller_auth.html)
 * - [UserController](./controller_user.html)
 *
 * ## Controller Class Declaration
 *
 * Each controller class is declarated by the decorators:
 *
 * - @Controller(prefix): the controller declaration
 * - @Get(path): GET `${prefix}${path}` router register declaration
 * - @Post(path): POST `${prefix}${path}` router register declaration
 * - ...
 *
 * Check [Web Decorators](../modules/util_web.html) for more.
 *
 * @module
 */
import { AccountController } from './account';
import { AuthController } from './auth';
import { HomeController } from './home';
import { UserController } from './user';

export const ControllerClasses = [
  HomeController,
  AccountController,
  UserController,
  AuthController
];
