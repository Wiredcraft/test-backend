import { ApiProperty } from '@nestjs/swagger';

export class BaseResponse {
  @ApiProperty({
    description: 'error code',
    example: 0,
  })
  code: number;

  @ApiProperty({
    description: 'track id',
    example: '605637ba06eb2062c8bd75f7',
  })
  requestId: string;
}
