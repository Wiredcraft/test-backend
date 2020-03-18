import mongoose from 'mongoose';
import mongooseHidden from 'mongoose-hidden';
import moment from 'moment';

export const UserSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: false },
    dob: {
      type: String,
      required: false,
      validate: {
        validator: function(v) {
          if (!v) {
            return true;
          }
          if (!/^\d+-\d+-\d+$/.test(v)) {
            return false;
          }
          return moment(v, 'YYYY-MM-DD').isValid();
        },
        message: props => `${props.value} is not a valid date!`,
      },
    }, // date of birth
    address: { type: String, required: false },
    description: { type: String, required: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  },
);

UserSchema.plugin(mongooseHidden(), { hidden: { _id: true, __v: true } });

UserSchema.index(
  {
    id: 1,
  },
  {
    unique: true,
  },
);

export const UserModel = mongoose.model('User', UserSchema);
