import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// User Modal
@Schema({
  versionKey: false,
})
export class User extends Document {
  /**
   * user name
   */
  @Prop({
    required: true,
    type: String,
  })
  name: string;

  /**
   * date of birth
   */
  @Prop({
    required: true,
    type: Date,
  })
  dob: Date;

  /**
   *  user address
   */
  @Prop({
    required: true,
    type: String,
  })
  address: string;

  /**
   * user address longitude
   */
  @Prop({
    required: false,
    type: Number,
    default: null,
  })
  longitude: number;

  /**
   * user address latitude
   */
  @Prop({
    required: false,
    type: Number,
    default: null,
  })
  latitude: number;

  /**
   * user description
   */
  @Prop({
    required: true,
    type: String,
  })
  description: string;

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
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('id').get(function () {
  return this._id;
});

UserSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc: User, ret: User) {
    delete ret._id;
  },
});

// name index
UserSchema.index(
  {
    name: 1,
  },
  {
    unique: true,
  },
);
