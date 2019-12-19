import {Body, Controller, Delete, Get, Param, Post, Put} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UserService} from "./user.service";
import {ApiParam, ApiTags} from "@nestjs/swagger";
import {UpdateUserDto} from "./dto/update-user.dto";

@ApiTags('user')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return await this.userService.create(createUserDto);
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.userService.findById(id);
    }

    @Put(':id')
    async updateById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return await this.userService.update(id, updateUserDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return await this.userService.remove(id);
    }
}
