import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class FollowsDto {
    @IsString()
    @ApiModelProperty({ description: 'follow user id' })
    uid: string;
}
