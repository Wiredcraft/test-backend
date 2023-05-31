const nodeExternals = require("webpack-node-externals");
const path = require("path");
const CreateFilePlugin = require("./plugins/CreateFilePlugin");

module.exports = function (options) {
  return {
    ...(options || {}),
    entry: [options?.entry],
    output: {
      filename: "main.js",
      publicPath: "/",
    },

    watch: false,
    externals: [nodeExternals()],
    plugins: [
      ...(options?.plugins || []),
      new CreateFilePlugin({
        fileName: `./dist/app.js`,
        fileContent: `require('bytenode');require('./main.jsc')`,
      }),
    ],
  };
};
