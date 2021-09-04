/* eslint-disable no-fallthrough */
import http = require("http");
import path = require("path");
import cluster = require("cluster");
import os = require("os");
import debug = require("debug");
import fs = require("fs-extra");
import colors = require("colors");
import moduleAlias from "module-alias";
moduleAlias.addAlias("@", path.join(__dirname, "../"));
import { app } from "../app";
import config from "../config";
import { Log } from "@/utils";
const httpPort = normalizePort(config.PORT);
const numCPUs = os.cpus().length;

app.on("error", onError);
const server = app.listen(httpPort, onListening);

function normalizePort(val: any): number {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    }
    if (port >= 0) {
        return port;
    }
    throw new Error("cannot resolve port.");
}

function onError(error: any): void {
    if (error.syscall !== "listen") {
        throw error;
    }
    const bind =
        typeof httpPort === "string" ? `Pipe ${httpPort}` : `Port ${httpPort}`;

    switch (error.code) {
        case "EACCES":
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
        case "EADDRINUSE":
            console.error(`${bind} is already in use`);
            process.exit(1);
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening(): void {
    console.log("################################################");
    Log.info(`运行地址为 http://127.0.0.1:${httpPort}`);
    console.log("################################################");
}

process.on("uncaughtException", (err) => {
    console.error(err);
});

process.on("unhandledRejection", (reason, p) => {
    console.error("Unhandled Rejection at: ", p);
});
