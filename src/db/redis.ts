import * as redis from "redis";
import config from "../config";

const { host, port } = config.redis;

let redisClient: any;

const redisInit = async () => {
    const client = redis.createClient({
        socket: {
            host: host,
            port: parseInt(port, 10),
        },
    });

    client.on("error", (err) => console.log("Redis Client Error", err));

    await client.connect();

    redisClient = client;
};

export { redisInit, redisClient };
