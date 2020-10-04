import {startServer} from "./server/server";

startServer().catch((err: Error) => console.log(err));

process.on("uncaughtException", (err: Error) => {
  console.log("process on unhandledRejection error:", err);
});
process.on("unhandledRejection", (reason, p) => {
  console.log("process on unhandledRejection:", reason, "promise:", p);
});
