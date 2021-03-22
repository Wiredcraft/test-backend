import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// User Modal
@Schema({
  versionKey: false,
})
export class UserFollow extends Document {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  userId: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  targetId: string;

  /**
   * user created date
   */
  @Prop({
    required: true,
    type: Date,
    default: () => Date.now(),
  })
  createdAt: Date;
}

// User Schema
export const UserFollowSchema = SchemaFactory.createForClass(UserFollow);

UserFollowSchema.index({
  userId: -1,
  createdAt: -1,
});

UserFollowSchema.index({
  targetId: 1,
  createdAt: -1,
});
