var express = require('express');
var router  = express.Router();
router.get('/',(req,res)=>{
    res.end('this is siri')
})
module.exports = router;
