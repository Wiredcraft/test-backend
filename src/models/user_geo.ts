import mongoose from "mongoose";
const { Schema, Document, Model } = mongoose;

export interface UserGeoEntity extends Document {
    _id: string;
    user_id: string;
    geo: [number];
}

// models directory only contains the definition of schema
const UserGeoSchema = new Schema({
    user_id: {
        type: String,
        required: true,
    },
    geo: {
        type: [Number],
        index: {
            type: "2dsphere",
            sparse: true,
        },
    },

    createdAt: { type: Date, default: Date.now },
});

const UserGeo = mongoose.model<UserGeoEntity>("user_geo", UserGeoSchema);

export default UserGeo;
