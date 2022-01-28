
function init () {
  setCurrentEnv(this.instance);
}
function setCurrentEnv (config) {
  // const currentEnv = process.env.NODE_ENV;
  const currentEnv = "production";
  switch (currentEnv) {
    case "localhost" :
      {
      // instance["env"] = require("./constVariables/localhostEnv.json");
      // env = require("./constVariables/localhostEnv.json");
      }
      break;
    case "development" :
      {
      // instance["env"] = require("./constVariables/developmentEnv.json");
      // env = require("./constVariables/developmentEnv.json");
      }
      break;
    case "production" :
      {
        config["env"] = require("./constVariables/productionEnv.json");
      // env = require("./constVariables/productionEnv.json");
      }
      break;
  }
}
module.exports = {
  instance : {},
  init
}
