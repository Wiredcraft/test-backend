/**
 * # User Controller
 *
 * The controller for user operation, such as get/update/delete
 * (create operation is up to AccountController's sign up).
 *
 * ## Injected Dependency
 *
 * - [UserService](../modules/service_user.html)
 *
 * ## APIs
 *
 * | Method | Path                  | Link
 * |--------|-----------------------|--------------------------
 * | GET    | /user/                | [Doc](../classes/controller_user.UserController.html#getList)
 * | GET    | /user/nearby          | [Doc](../classes/controller_user.UserController.html#getNearbyList)
 * | GET    | /user/:id             | [Doc](../classes/controller_user.UserController.html#getById)
 * | PATCH  | /user/:id             | [Doc](../classes/controller_user.UserController.html#update)
 * | DELETE | /user/:id             | [Doc](../classes/controller_user.UserController.html#delete)
 * | POST   | /user/relation/follow | [Doc](../classes/controller_user.UserController.html#follow)
 * | DELETE | /user/relation/follow | [Doc](../classes/controller_user.UserController.html#unfollow)
 *
 * See [index](./controller.html) for more controllers.
 *
 * @module
 */
import assert from 'assert';
import { validate } from 'class-validator';
import { Inject, Provide } from '../util/container';
import { Controller, Delete, Get, Guard, Patch, Post } from '../util/web';
import { ERROR } from '../config/constant';
import { NearbyType, UserService } from '../service/user';
import { User } from '../entity/user';
import { LoginRedirect } from '../middleware/loginRedirect';
import { StatCostTime } from '../middleware/stat';
import { Context } from '../interface';
import { RelationService } from '../service/relation';

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Inject()
  relationService: RelationService;

  /**
   * # GET /user/
   *
   * Get list of user.
   *
   * ## Parameters
   *
   * | Name         | Type   | Located | Required | Example             | Description
   * |--------------|--------|---------|----------|---------------------|-----
   * | page         | Number | Query   | No       | `2`                 | start from 0
   * | search       | String | Query   | No       | `'Alan'`            |
   *
   * ## Returns
   *
   * List of [\<User\>](../modules/entity_user.html) object.
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode                             | ErrorMessage | Description
   * |----------------|---------------------------------------|--------------|-------------
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Get('/')
  async getList(ctx: Context) {
    // 1. Construct data
    const page = Number(ctx.query.page) || 0;
    const { search } = ctx.query;
    const searchName = typeof search === 'string' ? search : '';

    // 2. Query
    const list = await this.userService.getList(searchName, page);
    ctx.body = list.map((user) => user.toJSON());
  }

  /**
   * # GET /user/nearby
   *
   * list login user's nearby
   *
   * ## Parameters
   *
   * | Name         | Type   | Located | Required | Example             | Description
   * |--------------|--------|---------|----------|---------------------|-----
   * | page         | Number | Query   | No       | `2`                 | start from 0
   * | type         | Number | Query   | No       | `0`                 | <ul><li>0 No relation</li><li>1 Followers</li><li>1 Following</li></ul>
   *
   *
   * ## Returns
   *
   * List of [\<User\>](../modules/entity_user.html) object.
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode  | ErrorMessage | Description
   * |----------------|------------|--------------|-------------
   * | 428            | 12200      | `No location found, please update location first` |
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Get('/nearby')
  @Guard(LoginRedirect)
  @Guard(StatCostTime)
  async getNearbyList(ctx: Context) {
    // 1. Construct data
    const page = Number(ctx.query.page) || 0;
    const type = Number(ctx.query.type) || NearbyType.NO_RELATION;

    // 2. Get signin user data
    const user = ctx.session.user;

    // 2. Query neighbour from user's location
    const list = await this.userService.getNearbyList(
      User.fromJSON(user),
      type,
      page
    );
    ctx.body = list.map((user) => user.toJSON());
  }

  /**
   * # GET /user/:id
   *
   * get user by id
   *
   * ## Parameters
   *
   * | Name         | Type   | Located | Required | Example             | Description
   * |--------------|--------|---------|----------|---------------------|-----
   * | id           | String | Params  | Yes      | `'62b7468e7d1dbf71da4c5646'`
   *
   * ## Returns
   *
   * List of [\<User\>](../modules/entity_user.html) object.
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode  | ErrorMessage | Description
   * |----------------|------------|--------------|-------------
   * | 404            |            | `not found`         |
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Get('/:id')
  async getById(ctx: Context) {
    // 1. Construct data
    const { id } = ctx.params;

    // 2. Query
    const one = await this.userService.getById(id);
    if (one) {
      ctx.body = one.toJSON();
    }
  }

  /**
   * # PATCH /user/:id
   *
   * patch user by id
   *
   * ## Parameters
   *
   * | Name      | Type       | Located | Required | Example             | Description
   * |-----------|------------|---------|----------|---------------------|-----
   * | id        | String     | Params  | Yes      | `'62b7468e7d1dbf71da4c5646'`
   * | name      | String     | Body    | No       | `"Allansin"`
   * | dob       | Number     | Body    | No       | `"1656172886000"`
   * | address   | String     | Body    | No       | `"Capital of Mars"`
   * |description| String     | Body    | No       | `"Someone boring"`
   * | location  | [Num, Num] | Body    | No       | `[120.21201, 30.2084]`
   *
   * ## Returns
   *
   * StatusCode 201 with empty body.
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode  | ErrorMessage | Description
   * |----------------|------------|--------------|-------------
   * | 403            | 1001       | `No permission`
   * | 400            | 10001      | `paramter validation failed: xxx`
   * | 404            |            | `not found`  | no data updated
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Guard(LoginRedirect)
  @Patch('/:id')
  async update(ctx: Context) {
    // 1. Check permission
    const { id } = ctx.params;
    const user = ctx.session?.user;
    assert(user?.id === id, ERROR.COMMON_NO_PERMISSION);

    // 2. Construct the data
    const { name, dob, address, description, location } = ctx.request.body;
    const tobeUpated = User.fromJSON(
      Object.assign({}, user, {
        name,
        dob,
        address,
        description,
        location
      })
    );

    // 3. Validate the data
    const errors = await validate(tobeUpated);
    assert(errors.length === 0, ERROR.ParameterValidationError(errors));

    // 4. Update
    const result = await this.userService.update(tobeUpated);
    if (result.affected) {
      ctx.status = 201;
    }
  }

  /**
   * # DELETE /user/:id
   *
   * delete user by id
   *
   * ## Parameters
   *
   * | Name      | Type       | Located | Required | Example             | Description
   * |-----------|------------|---------|----------|---------------------|-----
   * | id        | String     | Params  | Yes      | `'62b7468e7d1dbf71da4c5646'`
   *
   * ## Returns
   *
   * StatusCode 201 with empty body.
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode  | ErrorMessage | Description
   * |----------------|------------|--------------|-------------
   * | 403            | 1001       | `No permission`
   * | 404            |            | `not found`  | no data delete
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Guard(LoginRedirect)
  @Delete('/:id')
  async delete(ctx: Context) {
    // 1. Check permission
    const { id } = ctx.params;
    const user = ctx.session.user;
    assert(user?.id === id, ERROR.COMMON_NO_PERMISSION);

    // 2. Delete
    const results = await this.userService.delete(id);
    if (results.affected) {
      ctx.status = 201;
    }
  }

  /**
   * # POST /user/relation/follow
   *
   * Build following relationship
   *
   * ## Parameters
   *
   * | Name      | Type       | Located | Required | Example             | Description
   * |-----------|------------|---------|----------|---------------------|-----
   * | id        | String     | Body    | Yes      | `'62b7468e7d1dbf71da4c5646'`
   *
   * ## Returns
   *
   * StatusCode 201 with emtpy body.
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode  | ErrorMessage | Description
   * |----------------|------------|--------------|-------------
   * | 403            | 1001       | `No permission`
   * | 400            | 10000      | `invalid paramter: 'id'` |
   * | 404            | 11002      | `User not found` |
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Guard(LoginRedirect)
  @Post('/relation/follow')
  async follow(ctx: Context) {
    // 1. Check permission
    const user = ctx.session.user;
    assert(user?.id, ERROR.COMMON_NO_PERMISSION);

    // 2. Get parameters
    const { id } = ctx.request.body;
    assert(typeof id === 'string');
    assert(user.id !== id, ERROR.ParameterError('id')); // Can't follow itself

    // 3. Check if user to be followed exists
    const userToBeFollowed = await this.userService.getById(id);
    assert(userToBeFollowed, ERROR.MODEL_USER_GETONEBYID_USER_NOT_FOUND);

    // 4. Build following relationship
    const relation = await this.relationService.follow(user.id, id);
    if (relation) {
      ctx.status = 201;
    }
  }

  /**
   * # DELETE /user/relation/follow
   *
   * Break the following relationship
   *
   * ## Parameters
   *
   * | Name      | Type       | Located | Required | Example             | Description
   * |-----------|------------|---------|----------|---------------------|-----
   * | id        | String     | Body    | Yes      | `'62b7468e7d1dbf71da4c5646'`
   *
   * ## Returns
   *
   * StatusCode 201 with empty body.
   *
   * ## Error Codes
   *
   * | HttpStatusCode | ErrorCode  | ErrorMessage | Description
   * |----------------|------------|--------------|-------------
   * | 403            | 1001       | `No permission`
   * | 400            | 10000      | `invalid paramter: 'id'` |
   * | 404            | 11002      | `User not found` |
   *
   * Check [ErrorCode](../modules/constants.html) table for more.
   *
   * ## Class Method
   */
  @Guard(LoginRedirect)
  @Delete('/relation/follow')
  async unfollow(ctx: Context) {
    // 1. Check permission
    const user = ctx.session.user;
    assert(user?.id, ERROR.COMMON_NO_PERMISSION);

    // 2. Get parameters
    const { id } = ctx.request.body;
    assert(typeof id === 'string');
    assert(user.id !== id, ERROR.ParameterError('id')); // Can't follow itself

    // 3. Check if user to be unfollowed exists
    const userToBeFollowed = await this.userService.getById(id);
    assert(userToBeFollowed, ERROR.MODEL_USER_GETONEBYID_USER_NOT_FOUND);

    // 3. Break the relationship (unfollow)
    const result = await this.relationService.unfollow(user.id, id);
    if (result?.affected) {
      ctx.status = 201;
    }
  }
}
