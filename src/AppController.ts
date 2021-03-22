import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { BaseResponse } from './Common/BaseResponse';

export class GetServerTimestampResponse extends BaseResponse {
  @ApiProperty({
    description: 'timestamp',
    type: 'object',
    properties: {
      ts: {
        type: 'number',
        example: 1616243549394,
      },
    },
  })
  payload: {
    ts: number;
  };
}

@ApiTags('SystemService')
@Controller('sys')
export default class AppController {
  // return serve ts
  @ApiOperation({
    summary: 'Get Server time',
    description: 'return serve ts',
  })
  @ApiOkResponse({
    description: 'server ts',
    type: GetServerTimestampResponse,
  })
  @Get('/ping')
  getTimesTamp() {
    return {
      ts: Date.now(),
    };
  }
}
