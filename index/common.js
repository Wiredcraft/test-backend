const router = require("../router/index.js");
const express = require("express")
const bodyParser = require("body-parser")
const path = require("path");
const cors = require("cors");
const log4js = require("log4js");
const logger = require("../logger/index")
const appCommon = {
  init(app){
    app.use(log4js.connectLogger(logger, { level: "info"}))
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.text());
    app.use(bodyParser.urlencoded({
      extended: true
    }));
    app.use(express.static(path.join(__dirname,"../public")));
    app.use("/",router);
    app.on("error",(err)=>{
      if(err) console.log(err);
    });
  }
}
module.exports = appCommon;
