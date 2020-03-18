import {
  Controller,
  Dependencies,
  UseGuards,
  Get,
  Post,
  Put,
  Bind,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
@Dependencies(UsersService)
export class UsersController {
  constructor(usersService) {
    this.usersService = usersService;
  }

  @UseGuards(AuthGuard('HMAC'))
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
    return user.toJSON();
  }

  @UseGuards(AuthGuard('HMAC'))
  @Get(':id')
  @Bind(Param())
  async get(params) {
    const { id } = params;
    const user = await this.usersService.getById(id, {});
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user.toJSON();
  }

  @UseGuards(AuthGuard('HMAC'))
  @Put(':id')
  @Bind(Param(), Body())
  async update(params, body) {
    const { id } = params;
    const { name, dob, address, description } = body;

    let user;
    try {
      user = await this.usersService.update(id, { name, dob, address, description });
    } catch (err) {
      if (err.name === 'ValidationError') {
        throw new BadRequestException(err.message);
      } else {
        throw err;
      }
    }
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user.toJSON();
  }
}
