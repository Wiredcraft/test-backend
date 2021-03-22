import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFollowDto {
  @ApiProperty({
    description: 'target id',
    example: '605637ba06eb2062c8bd75f7',
  })
  @IsString()
  targetId: string;
}
