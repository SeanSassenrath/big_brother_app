var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

  profile: {
    username: String,
    created: {
      type: Date,
      default: Date.now
    },
    bio: String
  },
  local: {
    email: String,
    password: String,
  },
  facebook: {
    id: String,
    token: String,
    email: String,
    name: String,
    picture: String
  },
  players: [{
    player: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      title: String
    }
  }]
});

// methods
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// check if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);