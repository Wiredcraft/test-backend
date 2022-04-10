import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
@Schema()
export class BaseSchema {
  @ApiProperty({ type: String, description: '唯一id' })
  _id: Types.ObjectId;

  
  @ApiProperty({ type: Boolean, description: '是否删除' })
  @Prop({ required: false, default: false })
  archived: boolean;

  @ApiProperty({ type: Date, description: '创建时间' })
  @Prop({ required: true })
  createdAt: Date;
}
