import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ){}

  @Get(':id')
  async get(@Param() params: {id: string}){
    const user = await this.usersService.query(params)
    return {
      code: 0,
      data: {
        user
      }
    }
  }

  @Post()
  async create(@Body() userDto: CreateUserDto) {
    const user = await this.usersService.save(userDto)
    return {
      code: 0,
      data: {
        user
      }
    }
  }

  @Put(':id')
  async update(@Param() params: {id: string}, @Body() userDto: Partial<CreateUserDto>){
    await this.usersService.update(params.id, userDto)
    return {
      code: 0,
      data: {
        _id: params.id,
        ...userDto
      },
      msg: 'ok'
    }
  }

  @Delete(':id')
  async delete(@Param() params: {id: string}){
    await this.usersService.remove(params.id)
    return {
      code: 0,
      msg: 'ok'
    }
  }
}
