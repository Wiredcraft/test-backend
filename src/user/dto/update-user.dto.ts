/**
 * Proj. test-backend
 *
 * @author Yarco Wang <yarco.wang@gmail.com>
 * @since 2019/12/19 9:22 AM
 */
import {IsNotEmpty, IsDateString, IsOptional, IsDate, IsString, IsNumber} from "class-validator";
import {ApiModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class UpdateUserDto {
    @ApiModelProperty()
    @IsOptional()
    @IsString()
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
}
