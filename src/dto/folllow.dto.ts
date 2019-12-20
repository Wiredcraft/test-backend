import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class FollowDto {
    @IsString()
    @ApiModelProperty({ description: 'follow userId' })
    uid: string;
}
