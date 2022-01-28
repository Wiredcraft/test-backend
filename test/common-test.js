const assert = require("assert");
const commonController = require("../utils/common");

describe("# /utils/common.js", () => {

  describe("#isNullObject()", () => {
    it("isNullObject({}) should return true", () => {
      assert.strictEqual(commonController.isNullObject({}), true);
    });

    it("commonController.isNullObject({a:1}) should return false", () => {
      assert.strictEqual(commonController.isNullObject({a:1}), false);
    });
  });
});
