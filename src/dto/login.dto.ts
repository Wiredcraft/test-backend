import { IsString, IsNotEmpty } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @ApiModelProperty({ description: 'name' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiModelProperty({ description: 'password' })
    password: string;
}
