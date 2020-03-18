import {
  Controller,
  Dependencies,
  UseGuards,
  Get,
  Post,
  Put,
  Delete,
  Bind,
  Body,
  Param,
  Query,
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
  @Get('')
  @Bind(Query())
  async list(query) {
    const offset = query.offset ? parseInt(query.offset, 10) : 0;
    const limit = query.limit ? parseInt(query.limit, 10) : 10;

    const users = await this.usersService.list(offset, limit);
    return {
      meta: {
        offset,
        limit,
      },
      data: users.map(u => u.toJSON()),
    };
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
      user = await this.usersService.update(id, {
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
    if (!user) {
      throw new NotFoundException('User does not exist');
    }
    return user.toJSON();
  }

  @UseGuards(AuthGuard('HMAC'))
  @Delete(':id')
  @Bind(Param())
  async delete(params) {
    const { id } = params;

    await this.usersService.delete(id);

    return {};
  }
}
