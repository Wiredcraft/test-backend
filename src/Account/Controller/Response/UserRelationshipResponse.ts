import { BaseResponse } from '../../../Common/BaseResponse';
import { ApiProperty } from '@nestjs/swagger';

export class GetFollowListResponse extends BaseResponse {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          example: 'test name',
        },
        description: {
          type: 'string',
          example: 'test description',
        },
        id: {
          type: 'string',
          example: '605723b0c7d3f68248ea542b',
        },
      },
    },
  })
  payload: {
    name: string;
    description: string;
    id: string;
  }[];
}
