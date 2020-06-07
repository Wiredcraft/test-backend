const { handleResult } = require("jest-runner-newman/handle-result");
const newman = require("newman");

module.exports = newman.run(
  {
    collection: require.resolve("./collection.json"),
    iterationData: require.resolve("./data.json"),
    environment: require.resolve("./env.json"),
    reporters: ["cli"],
  },
  (err, result) => {
    handleResult(err, result);
  }
);
