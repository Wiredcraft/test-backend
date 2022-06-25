import assert from 'assert';
import { Context } from 'koa';
import { validate } from 'class-validator';
import { Inject, Provide } from '../util/container';
import { Controller, Delete, Get, Guard, Patch } from '../util/web';
import { ERROR } from '../config/constant';
import { UserService } from '../service/user';
import { User } from '../entity/user';
import { LoginRedirect } from '../middleware/loginRedirect';
import { StatCostTime } from '../middleware/stat';

@Provide()
@Controller('/user')
export class UserController {
  @Inject()
  userService: UserService;

  /**
   * GET /user/
   *
   * list user with page
   * @param ctx
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
   * GET /user/nearby
   *
   * list login user's nearby
   * @param ctx
   */
  @Get('/nearby')
  @Guard(LoginRedirect)
  @Guard(StatCostTime)
  async getNearbyList(ctx: Context) {
    // 1. Construct data
    const page = Number(ctx.request.body.page) || 0;

    // 2. Get signin user data
    const user = ctx.session?.user;
    assert(user, ERROR.COMMON_NO_PERMISSION);

    // 2. Query neighbour from user's location
    const list = await this.userService.getNearbyList(
      User.fromJSON(user),
      page
    );
    ctx.body = list.map((user) => user.toJSON());
  }

  /**
   * GET /user/:id
   *
   * get user by id
   * @param ctx
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
   * PATCH /user/:id
   *
   * patch user by id
   * @param ctx
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
   * DELETE /user/:id
   *
   * delete user by id
   * @param ctx
   */
  @Guard(LoginRedirect)
  @Delete('/:id')
  async delete(ctx: Context) {
    // 1. Check permission
    const { id } = ctx.params;
    const user = ctx.session?.user;
    assert(user?.id === id, ERROR.COMMON_NO_PERMISSION);

    // 2. Delete
    const results = await this.userService.delete(id);
    if (results.affected) {
      ctx.status = 201;
    }
  }
}
