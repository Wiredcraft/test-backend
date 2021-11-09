const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config({ path: "./../config.env" });

const config = process.env;

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if(!token){
    return res.status(403).json({message: "A token is required for Authentication"});
  }
  try{
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;
  } catch(err){
    return res.status(401).json({
      message: "Invalid Token",
      err
    });
  }
  return next();
};

module.exports = verifyToken;
