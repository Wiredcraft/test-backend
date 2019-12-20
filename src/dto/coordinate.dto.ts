import { IsNumber, IsOptional } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class CoordinateDto {

    @IsNumber()
    @IsOptional()
    @ApiModelProperty({ description: 'latitude' })
    latitude: number;

    @IsNumber()
    @IsOptional()
    @ApiModelProperty({ description: 'longitude' })
    longitude: number;
}
