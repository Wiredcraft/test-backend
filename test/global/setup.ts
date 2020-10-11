import * as sinon from "sinon";
import {Server} from "http";
import {startServer} from "../../src/server/server";
import {Redis} from "../../src/database/Redis";

let server: Server;

console.log(__filename);

before(() => {
  return new Promise((resolve) => {
    sinon.stub(Redis, "get").callsFake(() => {
      return {} as Redis;
    });

    startServer().then((started: Server) => {
      server = started;
      resolve();
    });
  });
});

after(() => {
  sinon.restore();

  server.close();
});
