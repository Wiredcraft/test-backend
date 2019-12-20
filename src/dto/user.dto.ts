import { ApiModelPropertyOptional, ApiModelProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CoordinateDto } from './coordinate.dto';

export class UserDto {
    @IsString()
    @IsNotEmpty()
    @ApiModelProperty({ description: 'name' })
    name: string;

    @IsString()
    @IsNotEmpty()
    @ApiModelProperty({ description: 'password' })
    password: string;

    @IsDate()
    @ApiModelProperty({ description: 'dob', type: 'string', format: 'date-time' })
    @IsOptional()
    dob?: Date;

    @IsString()
    @IsOptional()
    @ApiModelProperty({ description: 'address' })
    address?: string;

    @IsString()
    @IsOptional()
    @ApiModelProperty({ description: 'description' })
    description?: string;

    @ApiModelPropertyOptional({ description: 'coordinate', type: CoordinateDto})
    @Type(() => CoordinateDto)
    @IsOptional()
    coordinate?: CoordinateDto;
}
