import { Document } from "mongoose";

export interface UserFollow extends Document {
    readonly from: String,
    readonly to: String,
}