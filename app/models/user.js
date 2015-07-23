var mongoose  = require('mongoose');
var bcrypt    = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({

  // need to make profile an array of objects
  profile: {
    email: String,
    username: String,
    password: String,
    bio: String,
    created: {
      type: Date,
      default: Date.now
    }
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
UserSchema.pre('save', function(next) {
  var user = this;

  if(!user.isModified('profile.password')) return next();

  bcrypt.hash(user.profile.password, null, null, function(err, hash) {
    if(err) return next(err);
    user.profile.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(password) {
  var user = this;

  return bcrypt.compareSync(password, user.profile.password);
};

module.exports = mongoose.model('User', UserSchema);