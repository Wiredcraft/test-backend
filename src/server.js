#!/usr/bin/env node

import mongoose from "mongoose";

import { app, config, logger } from "./index";

const { PORT, MONGODB_CONNECTION } = config;

/**
 * connect to mongodb
 */
mongoose.Promise = Promise;
mongoose.connect(MONGODB_CONNECTION, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  auto_reconnect: true,
  // reconnectInterval: 30 * 1000,
  // reconnectTries: 1000,
  keepAlive: true,
  connectTimeoutMS: 30 * 1000,
});
// mongoose.connection.on("open", async () => {
//   // some init function
// });
mongoose.connection.on("error", () => {
  logger.error("mongodb connection error");
});

/**
 * start app
 */
app.listen(PORT, () =>
  logger.info(`[${process.env.NODE_ENV}] http server start on port ${PORT} 🚀`)
);
