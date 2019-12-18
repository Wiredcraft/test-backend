let mongoose = require('mongoose');
var crypto = require('crypto');
let Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  salt: {
    type: String
  }
});

UserSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')){
        return next();
    }

    user.password = this.encryptPassword(user.password);
    next();
});

UserSchema.methods.encryptPassword = function(password) {
    this.salt = crypto.randomBytes(128).toString('hex');
    return crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};


UserSchema.virtual('userId')
     .get(function () {
         return this.id;
     });
/*
UserSchema.virtual('password')
     .set((password) => {
         this._plainPassword = password;
             this.salt = crypto.randomBytes(64).toString('hex');
             this.hashedPassword = this.encryotPassword(password);
     })
     .get(() => {return this._plainPassword;});
*/

UserSchema.methods.validatePassword = function(password) {
    return this.encryptPassword(password) === this.password;
};


// Export the Mongoose model
const User = mongoose.model('User', UserSchema);

User.init().then(() => {
    console.log("User initialized...");
});

module.exports = User; 

