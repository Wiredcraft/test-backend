import mongoose from "mongoose";
const { Schema, Document, Model } = mongoose;

export interface UserEntity extends Document {
    name: string;
    dob?: Date;
    address?: string;
    description?: string;
    created?: Date;
}

// models directory only contains the definition of schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    dob: Date,
    address: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model<UserEntity>("user", UserSchema);

export default User;
