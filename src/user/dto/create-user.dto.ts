/**
 * Proj. test-backend
 *
 * @author Yarco Wang <yarco.wang@gmail.com>
 * @since 2019/12/18 11:35 PM
 */
import {IsNotEmpty, IsDateString, IsOptional, IsDate, IsString, IsNumber} from "class-validator";
import {ApiModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class CreateUserDto {
    @ApiModelProperty()
    @IsNotEmpty()
    name: string;

    @ApiModelProperty()
    @IsOptional()
    dob: string;

    @ApiModelProperty()
    @IsOptional()
    address: string;

    @ApiModelProperty()
    @IsOptional()
    description: string;

    @ApiModelProperty()
    @IsOptional()
    @IsNumber()
    createdAt: Number;
}
