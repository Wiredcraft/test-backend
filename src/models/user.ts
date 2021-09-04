import mongoose from "mongoose";
const { Schema } = mongoose;

// models directory only contains the definition of schema
const UserSchema = new Schema({
    name: String, // String is shorthand for {type: String}
    dob: String,
    address: String,
    description: String,
    createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("user", UserSchema);

export default User;
