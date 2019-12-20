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
    @IsNotEmpty()
    password: string;

    @ApiModelProperty({required: false})
    @IsOptional()
    dob: string;

    @ApiModelProperty({required: false})
    @IsOptional()
    address: string;

    @ApiModelProperty({required: false})
    @IsOptional()
    description: string;
}
