let mongoose = require('mongoose');
var bcrypt = require('crypto');
let Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  hashedpassword: {
    type: String,
    required: true
  },
  salt: {
    type: String
  }
});

UserSchema.methods.encryptPassword = function(password) {
    return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.virtual('userId')
     .get(function () {
         return this.id;
     });

UserSchema.virtual('password')
     .set((password) => {
         this._plainPassword = password;
             this.salt = crypto.randomBytes(128).toString('hex');
             this.hashedPassword = this.encryotPassword(password);
     })
     .get(() => {return this._plainPassword;});

UserSchema.methods.validatePassword = function(password) {
    return this.setPassword(password) === this.hashedPassword;
};


// Export the Mongoose model
const User = mongoose.model('User', UserSchema);
module.exports = User;
