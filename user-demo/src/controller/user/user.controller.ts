import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from '../../services/user/user.service';
import { CreateUserDto } from '../../dto/create-user.dto';
import { ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ){

    }

    @Get()
    @ApiResponse({description:'成功',status: 200} )
    async getAllUsers(){
        return this.userService.findAll()
    }

    @ApiBody({ type: CreateUserDto ,required:true})
    @ApiResponse({description:'成功',status: 200} )
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto){
        return this.userService.create(createUserDto)
    }

    @ApiBody({ type: CreateUserDto })
    @ApiResponse({description:'成功',status: 200} )
    @Put()
    async updateUser(@Body() createUserDto: CreateUserDto){
        return this.userService.updateById(createUserDto)
    }

    @ApiParam({name:'userId',description:"userid" })
    @ApiResponse({description:'成功',status: 200} )
    @Delete(':userId')
    async deleteUser(@Param('userId') id: number){
        return this.userService.deleteById(id);
    }
}


