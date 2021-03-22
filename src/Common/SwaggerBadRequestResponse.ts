import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse<T> {
  @ApiProperty({
    type: Number,
    required: true,
    description: 'error code, see ErrorCode',
  })
  code: number;

  @ApiProperty({
    type: String,
    required: true,
    description: 'error message, see ErrorMessage',
  })
  message: string;

  @ApiProperty({
    type: 'object',
    required: true,
    description: 'error detail, prod will not return',
  })
  details: T[];

  @ApiProperty({
    type: String,
    required: true,
    description: 'trace id',
  })
  requestId: string[];
}

export default () => ({
  description: 'Error Response',
  type: ErrorResponse,
});
