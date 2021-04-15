/* eslint-disable mocha/handle-done-callback */
import {Context} from 'mocha';
import {GenericContainer, StartedTestContainer} from 'testcontainers';

async function mongoStart() {
  const container = await new GenericContainer('mongo').withName('mongo_test').withExposedPorts(27017).start();
  process.env.DB_HOST = container.getContainerIpAddress();
  process.env.DB_PORT = container.getMappedPort(27017).toString();
  return container;
}

let mongo: StartedTestContainer;

before(async function (this: Context) {
  this.timeout(50 * 10000);
  mongo = await mongoStart();
});

after(async function (this: Context) {
  this.timeout(50 * 10000);
  await mongo.stop();
});
