import * as chai from "chai";
import * as Joi from "@hapi/joi";

console.log(__filename);

import {arrDeleteIndex, genDbKey, validateWithJoi} from "../../src/utility/Utility";

const expect = chai.expect;

describe("Utility", () => {
  it("genDbKey equal", () => {
    expect(genDbKey("SOME_KEY:%ID%", {"%ID%": 1})).to.equal("SOME_KEY:1");
  });

  it("validateWithJoi failure", () => {
    const schema = Joi.string().uuid({version: ["uuidv4"]}).required();
    return validateWithJoi(schema, "123").then((result) => {
      expect(result).to.include.keys("error");
      expect(result.error).not.to.be.equal(null);
      expect(result.error.message).to.include("\"value\" must be a valid GUID");
    });
  });

  it("validateWithJoi success", () => {
    const schema = Joi.string().uuid({version: ["uuidv4"]}).required();
    return validateWithJoi(schema, "a610aea1-020e-4506-aeb4-f60018545ec6").then((result) => {
      expect(result).to.include.keys("error");
      expect(result.error).to.be.equal(null);
    });
  });

  it("arrDeleteIndex", () => {
    expect(arrDeleteIndex([1, 2, 3], 1)).not.to.include(2);
  });
});
