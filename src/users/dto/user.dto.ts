import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsDate,
  IsISO8601,
  IsNotEmpty,
  IsString,
  Length,
} from "class-validator";

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
    name: "dob",
    default: "1999-01-01",
    description: "user date of birth, in yyyy-MM-DD format e.g. 1999-01-01",
  })
  @IsDate()
  @Type(() => Date)
  dob: Date;

  @ApiProperty({
    name: "address",
    description: "user address, max length: 100",
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  address: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 300)
  @ApiProperty({
    name: "description",
    description: "user description, max length: 300",
  })
  description: string;
}
