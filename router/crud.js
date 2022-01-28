var express = require("express");
var router  = express.Router();
const crudController = require("../controllers/crudController");
const commonController = require("../mongodb/common")
router.get("/get", commonController.apiConnector(crudController.getUser));
router.put("/create", commonController.apiConnector(crudController.createUser));
router.post("/update",commonController.apiConnector(crudController.updateUser));
router.delete("/delete",commonController.apiConnector(crudController.deleteUser));

module.exports = router;
