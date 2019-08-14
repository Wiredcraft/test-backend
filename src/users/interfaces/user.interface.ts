import { Document } from "mongoose";

export interface User extends Document {
    readonly id: String,
    readonly name: String,
    readonly dob: Date,
    readonly address: String,
    readonly description: String,
    readonly createdAt: Date,
}