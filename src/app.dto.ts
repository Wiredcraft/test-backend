import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional } from "class-validator";
import paginationConfig from "./config/pagniation.config";

export class PaginationQueryDto {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    description: "page number",
    required: false,
    default: paginationConfig.defaultPage,
  })
  page: number; //page number

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @ApiProperty({
    description: "records per page",
    required: false,
    default: paginationConfig.defaultPerPage,
  })
  perPage: number; //records per page
}
