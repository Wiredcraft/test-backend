import * as mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    id: {
        type: String,
        index: {
            unique: true,
        },
        required: true,
    },
    name: {
        index: true,
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    address: {
        index: true,
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    createdAt: {
        type: Date,
        index: true,
        default: Date.now,
    }
});