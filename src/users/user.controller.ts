import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from ".prisma/client";

@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<User | null> {
    return this.userService.findById(id);
  }

  @Post()
  async create(@Body() user: Partial<User>): Promise<User> {
    return this.userService.create(user);
  }

  @Put(":id")
  async update(
    @Param("id") id: string,
    @Body() user: Partial<User>
  ): Promise<User | null> {
    return this.userService.update(id, user);
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<User | null> {
    return this.userService.delete(id);
  }
}
