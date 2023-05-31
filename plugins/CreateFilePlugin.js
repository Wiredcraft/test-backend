const fs = require("fs");

class CreateFilePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tap("CreateFilePlugin", () => {
      const { fileName, fileContent } = this.options;

      fs.writeFile(fileName, fileContent, (err) => {
        if (err) {
          console.error(`Error creating file: ${err}`);
        } else {
          console.log(`File '${fileName}' created successfully.`);
        }
      });
    });
  }
}

module.exports = CreateFilePlugin;
