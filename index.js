const http = require("http");
const app = require("./index/index.js");
const httpServer = http.createServer(app);

const mongodbController = require("./mongodb/index");
const configController = require("./config/index");
configController.init();
mongodbController.init().then(()=>{
  console.log("mongodb is ready")
});
httpServer.listen(80,()=>{
  console.log("httpServer is ready")
})

