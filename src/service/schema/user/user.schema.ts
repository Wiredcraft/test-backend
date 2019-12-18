import * as crypto from 'crypto';
import * as moment from 'moment';
import { Schema } from 'mongoose';
import { User } from './user.interface';
export const UserSchema = new Schema({
    name: { type: String, required: true , unique: true},
    password: {type: String, required: true},
    dob: { type: Date },
    address: { type: String },
    description: { type: String },
    coordinate: {
        type: {
            latitude: Number,
            longitude: Number,
        },
    },
}, {
    timestamps: {
        createdAt: 'createdAt',
    },
});

UserSchema.pre<User>('save', function(next) {
    const user = this;
    if (!user.isModified('password')) {
        next();
    }
    const password = crypto.createHmac('sha256', user.password).digest('hex');
    user.password = password;
    next();
});

UserSchema.methods.authenticateUser = function(
    password: string,
): boolean {
    const user = this;
    const passHash = crypto.createHmac('sha256', password).digest('hex');

    if (user.password === passHash) {
        return true;
    }
    return false;
};

UserSchema.virtual('age').get(function() {
    const user = this;
    return moment().year() - moment(user.dob).year() + 1;
});
