import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UsePipes,
} from "@nestjs/common";
import { UserService } from "./user.service";
import UserDto from "./dto/user.dto";
import { ApiTags } from "@nestjs/swagger";
import { RequestStripPipe } from "@wiredcraft/pipes/request-strip.pipe";

@Controller("users")
@ApiTags("User APIs")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(): Promise<UserDto[]> {
    const resp = await this.userService.findAll();
    return resp;
  }

  @Get(":id")
  async findById(@Param("id") id: string): Promise<UserDto | null> {
    const resp = await this.userService.findById(id);
    return resp;
  }

  @Post()
  @UsePipes(new RequestStripPipe())
  async create(@Body() user: UserDto): Promise<UserDto> {
    const resp = await this.userService.create(user);
    return resp;
  }

  @Put(":id")
  @UsePipes(new RequestStripPipe())
  async update(
    @Param("id") id: string,
    @Body() user: UserDto
  ): Promise<UserDto> {
    const resp = await this.userService.update(id, user);
    return resp;
  }

  @Delete(":id")
  async delete(@Param("id") id: string): Promise<UserDto> {
    const resp = await this.userService.delete(id);
    return resp;
  }
}
