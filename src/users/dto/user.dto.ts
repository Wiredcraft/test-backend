import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export default class UserDto {
  id: string;

  @ApiProperty({
    name: "name",
    description: "user name",
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: "email address to identify user",
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    name: "dob",
    default: "1999-01-01",
    description: "user date of birth, in yyyy-MM-DD format e.g. 1999-01-01",
  })
  @IsDate({ message: "dob must be in yyyy-MM-DD format. e.g. 1999-01-01" })
  @Type(() => Date)
  dob: Date;

  @ApiProperty({
    name: "address",
    description: "user address, max length: 100",
  })
  @IsString()
  @Length(0, 100)
  address: string;

  @IsString()
  @Length(0, 300)
  @ApiProperty({
    name: "description",
    description: "user description, max length: 300",
  })
  description: string;
}
