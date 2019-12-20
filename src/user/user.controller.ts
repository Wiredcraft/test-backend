import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put, SerializeOptions,
    UseInterceptors
} from '@nestjs/common';
import {CreateUserDto} from "./dto/create-user.dto";
import {UserService} from "./user.service";
import {ApiBadRequestResponse, ApiCreatedResponse, ApiOkResponse, ApiParam, ApiTags} from "@nestjs/swagger";
import {UpdateUserDto} from "./dto/update-user.dto";
import {User} from "./models/user.m";

@ApiTags('User')
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    @ApiCreatedResponse({description: 'user created'})
    @ApiBadRequestResponse({description: 'client error'})
    async create(@Body() createUserDto: CreateUserDto) {
        await this.userService.create(createUserDto);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Get(':id')
    @ApiOkResponse({description: 'user information', type: User})
    async findById(@Param('id') id: string): Promise<User> {
        let user = await this.userService.findById(id);
        return new User(user);
    }

    @UseInterceptors(ClassSerializerInterceptor)
    @Put(':id')
    @ApiOkResponse({description: 'user information', type: User})
    async updateById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        let user = await this.userService.update(id, updateUserDto);
        return new User(user);
    }

    @Delete(':id')
    @ApiOkResponse({description: 'user removed'})
    async remove(@Param('id') id: string) {
        await this.userService.remove(id);
    }
}
