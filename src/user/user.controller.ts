import { Controller, Post, Body, Put, Get, Param, Query, Delete, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiUseTags, ApiOperation } from '@nestjs/swagger';
import { UserDto } from '../dto/user.dto';
import { ParseIntPipe } from '../common/pipes/parse-number.pipe';
import { UserUpdateDto } from '../dto/user.update.dto';
import { LoginDto } from '../dto/login.dto';
@ApiUseTags('user')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post()
    @ApiOperation({ title: 'create user' })
    async create(@Body() body: UserDto) {
        const res = await this.userService.create(body);
        return res;
    }

    @Put(':id')
    @ApiOperation({ title: 'update user' })
    async update(@Param('id') id: string, @Body() body: UserUpdateDto) {
        const res = await this.userService.findByIdAndUpdate(id, { $set: body }, {upsert: true});
        return res;
    }

    @Get(':id')
    @ApiOperation({ title: 'get user' })
    async findOne(@Param('id') id: string) {
        const res = await this.userService.findById(id);
        return res;
    }

    @Get()
    @ApiOperation({ title: 'get users' })
    async findAll(
        @Query('page', new ParseIntPipe()) page: number,
        @Query('limit', new ParseIntPipe()) limit: number) {
            const res = await this.userService.findAll({}, {password: 0});
            return res;
    }

    @Delete()
    @ApiOperation({ title: 'remove user' })
    async removeUser(@Param('id') id: string) {
        const res = await this.userService.delete(id);
        return res;
    }

    @Post('login')
    @ApiOperation({ title: 'login' })
    async login(@Body() body: LoginDto) {
        return this.userService.login(body.name, body.password);
    }
}
