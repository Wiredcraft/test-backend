var express=require("express");
var router=express.Router();
const routerTest1 = require("./routerTest1");
const crud = require("./crud");
router.use("/test1",routerTest1);
router.use("/crud", crud)
module.exports = router;
