exports.generateToken = (user) => {  
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

exports.setUserInfo = (request) => {
  return {
    _id: request._id,
    email: request.email,
    role: request.role
  };
}
