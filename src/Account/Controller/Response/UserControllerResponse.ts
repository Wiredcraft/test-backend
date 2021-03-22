import { BaseResponse } from '../../../Common/BaseResponse';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponse extends BaseResponse {
  @ApiProperty({
    description: 'CreateUserResponse',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        example: '6054eb0fa115eaa16497af6a',
      },
    },
    example: {
      id: '6054e12d0837b6a77c9a9425',
    },
  })
  payload: {
    id: string;
  };
}

export class GetUserGeoInfoResponse extends BaseResponse {
  @ApiProperty({
    description: 'GetUserGeoInfoResponse',
    type: 'object',
    properties: {
      latitude: {
        type: 'number',
        example: 2.333333,
      },
      longitude: {
        type: 'number',
        example: 1.14514,
      },
    },
  })
  payload: {
    latitude: string;
    longitude: string;
  };
}

export class GetUserNearByFriendResponse extends BaseResponse {
  @ApiProperty({
    description: 'nearby friend',
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          example: '6054eb0fa115eaa16497af6a',
        },
        name: {
          type: 'string',
          example: 'test name',
        },
        description: {
          type: 'test description',
          example: 'test description',
        },
        longitude: {
          type: 'number',
          example: 2.333333,
        },
        latitude: {
          type: 'number',
          example: 2.333333,
        },
        distance: {
          type: 'number',
          example: 1.14514,
        },
        fansCount: {
          type: 'number',
          example: 114,
        },
        followCount: {
          type: 'number',
          example: 514,
        },
        unit: {
          type: 'string',
          enum: ['m', 'km'],
        },
      },
    },
  })
  payload: {
    id: string;
    name: string;
    description: string;
    longitude: number;
    latitude: number;
    distance: number;
    fansCount: number;
    followCount: number;
    unit: 'm' | 'km';
  }[];
}
