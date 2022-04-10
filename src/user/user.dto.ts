import {
  IsNumber,
  IsPositive,
  Max,
  IsString,
  IsISO8601,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IdDto {
  @ApiProperty()
  id: string;
}

export class GetUsersDto {
  @ApiProperty({ required: false, description: '查询条件：跳过多少条记录' })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  skip: number;

  @ApiProperty({ required: false, description: '查询条件：获取多少条记录' })
  @IsNumber()
  @IsPositive()
  @Max(100)
  @IsOptional()
  take: number;

  @ApiProperty({ required: false, description: '查询条件：用户姓名' })
  @IsString()
  @IsOptional()
  name: string;
}

export class RegisterUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  userName: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  password: string;
}

export class LoginDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  userName: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  password: string;
}

export class CreateUserDto {
  @ApiProperty({ description: '姓名' })
  @IsString()
  name: string;

  @ApiProperty({ description: '出生时间' })
  @IsISO8601()
  @IsOptional()
  dob: Date;

  @ApiProperty({ description: '地址' })
  @IsString()
  address: string;

  @ApiProperty({ description: '简介' })
  @IsString()
  description: string;
}

export class UpdateUserDto {
  @ApiProperty({ required: false, description: '姓名' })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false, description: '出生时间' })
  @IsISO8601()
  @IsOptional()
  dob: Date;

  @ApiProperty({ required: false, description: '地址' })
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({ required: false, description: '简介' })
  @IsString()
  @IsOptional()
  description: string;
}

export class LoginResult {
  @ApiProperty({ description: '用户令牌' })
  token: string;
}
