/**
 * Proj. test-backend
 *
 * @author Yarco Wang <yarco.wang@gmail.com>
 * @since 2019/12/19 9:22 AM
 */
import {IsNotEmpty, IsDateString, IsOptional, IsDate, IsString, IsNumber} from "class-validator";
import {ApiModelProperty} from "@nestjs/swagger/dist/decorators/api-model-property.decorator";

export class UpdateUserDto {
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
