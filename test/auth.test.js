import appManager from "./app-manager";
import { createUser } from "./util";

describe("Authentication service", () => {
  beforeEach(async () => {
    await appManager.start();
  });

  afterEach(async () => {
    await appManager.stop();
  });

  it("ok", async () => {
    expect(2).toEqual(2);
  });
});
