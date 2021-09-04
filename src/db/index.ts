import mongoose from "mongoose";
import config from "../config";
const { host, user, password } = config.db;
let status = "DISCONNETED";

const init = () => {
    const database = "test";

    if (status === "DISCONNETED") {
        let mongoUrl = `mongodb://${host}/${database}`;
        if (user && password) {
            mongoUrl = `mongodb://${user}:${password}@${host}:27017/${database}?authSource=admin`;
        }
        mongoose.connect(mongoUrl);
        status = "CONNECTING";
        const db = mongoose.connection;
        return new Promise<void>((resolve, reject) => {
            db.on("error", (err) => {
                status = "DISCONNETED";
                console.error(err);
                reject(err);
            });
            db.once("open", () => {
                status = "CONNECTED";
                console.info("Database connected");
                resolve();
            });
        });
    }
};

export default { init };
