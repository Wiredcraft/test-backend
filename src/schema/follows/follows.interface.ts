import { Types, Document } from 'mongoose';

export interface Follows extends Document {
    uid: Types.ObjectId;
    followId: Types.ObjectId;
    createdAt: Date;
}
