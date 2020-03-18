import {
  Controller,
  Dependencies,
  Get,
  Post,
  Bind,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
@Dependencies(UsersService)
export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  @Post('')
  @Bind(Body())
  async create(body) {
    const { id, name, dob, address, description } = body;

    let oldUser;
    oldUser = await this.usersService.getById(id);
    if (!!oldUser) {
      throw new BadRequestException('User already exists.');
    }

    let user;
    try {
      user = await this.usersService.create(id, {
        name,
        dob,
        address,
        description,
      });
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException(err.message);
      } else {
        throw err;
      }
    }
    return {
      id: user.id,
    };
  }

  @Get(':id')
  @Bind(Param())
  async get(params) {
    const { id } = params;
    const user = await this.usersService.getById(id);
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user.toJSON();
  }
}
