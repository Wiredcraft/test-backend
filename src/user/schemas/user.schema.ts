/**
 * Proj. test-backend
 *
 * @author Yarco Wang <yarco.wang@gmail.com>
 * @since 2019/12/18 11:05 PM
 */
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
    name: String,
    password: String,
    dob: String,
    address: String,
    description: String,
    createdAt: {type: Date, default: Date.now()}
});
