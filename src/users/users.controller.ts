import { Controller, Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus } from "@nestjs/common";
import { UserService } from "./users.service";
import { User } from "./interfaces/user.interface";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { FollowUserDto } from "./dto/follow-user.dto";
import { UserFollow } from "./interfaces/user-follow.interface";

@Controller('user')
export class UserController {
    constructor(private readonly usersService: UserService) { }

    /**
     * @apiDefine UserNotFoundError
     * @apiVersion 1.0.0 
     *
     * @apiError UserNotFound The <code>id</code> of the User was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "statusCode": 404,
     *       "message": "User Not Found"
     *     }
     */

    /**
     * @api {get} /user/:id Get User information
     * @apiVersion 1.0.0 
     * @apiName GetUser
     * @apiGroup User
     *
     * @apiParam {String} id User's unique ID.
     *
     * @apiSuccess {String} id ID
     * @apiSuccess {String} name name
     * @apiSuccess {Date} dob birthday
     * @apiSuccess {String} address address
     * @apiSuccess {String} description description
     * @apiSuccess {Date} createdAt register date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "001",
     *       "name": "matrix",
     *       "dob": "2001-01-01T00:00::00Z",
     *       "address": "shanghai jing an temple",
     *       "description": "rich man",
     *       "createdAt": "2019-01-01T00:00::00Z"
     *     }
     *
     * @apiUse UserNotFoundError
     */
    @Get(':id')
    async findOne(@Param() params) {
        return this.usersService.findOne(params.id).then((user) => {
            if (null == user) {
                throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
            }
        });
    }

    /**
     * @api {post} /user/ Create User information
     * @apiVersion 1.0.0 
     * @apiName PostUser
     * @apiGroup User
     *
     * 
     * @apiParam {String} id unique ID of the User.
     * @apiParam {String} name name ID of the User.
     * @apiParam {Date} dob birthday of the User.
     * @apiParam {String} address address of the User.
     * @apiParam {String} [description] description of the User.
     * 
     * @apiSuccess {String} id ID
     * @apiSuccess {String} name name
     * @apiSuccess {Date} dob birthday
     * @apiSuccess {String} address address
     * @apiSuccess {String} description description
     * @apiSuccess {Date} createdAt register date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "001",
     *       "name": "matrix",
     *       "dob": "2001-01-01T00:00::00Z",
     *       "address": "shanghai jing an temple",
     *       "description": "rich man",
     *       "createdAt": "2019-01-01T00:00::00Z"
     *     }
     *
     */
    @Post()
    async createOne(@Body() createUserDto: CreateUserDto) {
        return this.usersService.createOne(createUserDto);
    }

    /**
     * @api {put} /user/ Modify User information
     * @apiVersion 1.0.0 
     * @apiName PutUser
     * @apiGroup User
     *
     * @apiParam {Date} [dob] birthday of the User.
     * @apiParam {String} [address] address of the User.
     * @apiParam {String} [description] description of the User.
     * 
     * @apiSuccess {String} id ID
     * @apiSuccess {String} name name
     * @apiSuccess {Date} dob birthday
     * @apiSuccess {String} address address
     * @apiSuccess {String} description description
     * @apiSuccess {Date} createdAt register date
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "id": "001",
     *       "name": "matrix",
     *       "dob": "2001-01-01T00:00::00Z",
     *       "address": "shanghai jing an temple",
     *       "description": "rich man",
     *       "createdAt": "2019-01-01T00:00::00Z"
     *     }
     *
     *
     * @apiUse UserNotFoundError
     */

    @Put(':id')
    async updateOne(@Param() params, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.findOneAndUpdate(params.id, updateUserDto).then((user) => {
            if (null == user) {
                throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
            }
        });
    }

    /**
     * @api {delete} /user/:id Delete User information
     * @apiVersion 1.0.0 
     * @apiName DeleteUser
     * @apiGroup User
     *
     * @apiParam {String} id User's unique ID.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     * @apiUse UserNotFoundError
    */

    @Delete(':id')
    async deleteOne(@Param() params) {
        return this.usersService.deleteOne(params.id).then((res) => {
            if (res.n == 0) {
                throw new HttpException("User Not Found", HttpStatus.NOT_FOUND);
            } else {
                return "";
            }
        });
    }

    /**
     * @api {post} /user/follow User follow another user
     * @apiVersion 1.0.0 
     * @apiName PostFollowUser
     * @apiGroup User
     *
     * @apiParam {String} from The User's ID who follow another one.
     * @apiParam {String} to The User's ID who followed by from.
     * 
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
    */
    @Post('follow')
    async followOne(@Body() followUserDto: FollowUserDto) {
        return this.usersService.followOne(followUserDto).then((_) => {
            return "";
        });
    }

    /**
     * @api {delete} /user/follow User unfollow another user
     * @apiVersion 1.0.0 
     * @apiName DeleteFollowUser
     * @apiGroup User
     *
     * @apiParam {String} from The User's ID who unfollow another user.
     * @apiParam {String} to The User's ID who followed by from.
     * 
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
    */
    @Delete('follow')
    async unfollowOne(@Body() followUserDto: FollowUserDto) {
        return this.usersService.unfollowOne(followUserDto).then((_) => {
            return "";
        });;
    }
}