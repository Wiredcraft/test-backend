import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import usersRouters from "./routes/users.js";
import { connectDB } from "./config/db.js";

dotenv.config({ path: "./config/config.env" });
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use("/users", usersRouters);

app.listen(PORT, () => console.log(`Server running: http://localhost:${PORT}`));
