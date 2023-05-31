import { MongoMemoryReplSet } from "mongodb-memory-server";

export const createPrismaMockService = async (dbName, count = 1) => {
  return await MongoMemoryReplSet.create({
    replSet: {
      dbName,
      count,
      storageEngine: "wiredTiger",
    },
    instanceOpts: [
      {
        storageEngine: "wiredTiger",
      },
    ],
  });
};
