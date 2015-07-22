var LocalStrategy     = require('passport-local').Strategy;
var FacebookStrategy  = require('passport-facebook').Strategy;
var User              = require('../app/models/user');
var configAuth = require('./auth');

// expose this function to our server
module.exports = function(passport) {
  // passport session setup
  // required fro persistent login sessions
  // passport needs to be able to serialize and unserialize users out of session

  // serialize the user for the session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  // local sign up
  passport.use('local-signup', new LocalStrategy({
    // by default local strategy uses username and password, we will override with email
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function(req, email, password, done) {
    // User.findOne wont fire unless data is sent back
    process.nextTick(function() {
      // find a user whose email is the same as the forms email
      // we are checking to see if the user trying to login already exists
      User.findOne({ 'local.email': email }, function(err, user) {
        if (err)
          return done(err);

        if (user) {
          return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
        } else {
          var newUser             = new User();

          newUser.local.email     = email;
          newUser.local.password  = newUser.generateHash(password);

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
    });
  }));

  // local login
  passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done) {
    User.findOne({ 'local.email': email }, function(err, user) {
      if (err)
        return done(err);

      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found'));

      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

      return done(null, user);
    });
  }));

  // facebook
  passport.use(new FacebookStrategy({
    clientID      :configAuth.facebookAuth.clientID,
    clientSecret  :configAuth.facebookAuth.clientSecret,
    callbackURL   :configAuth.facebookAuth.callbackURL,
    profileFields: ['id', 'displayName', 'name', 'gender', 'photos', 'birthday', 'about', 'email']
  },
  function(token, refreshToken, profile, done) {
    process.nextTick(function() {
      User.findOne({ 'facebook.id': profile.id}, function(err, user) {
        if (err)
          return done(err);

        if (user) {
          return done(null, user);
        } else {
          var newUser               = new User();
          newUser.facebook.id       = profile.id;
          newUser.facebook.token    = token;
          newUser.facebook.name     = profile.name.givenName;
          newUser.facebook.email    = profile.emails[0].value;
          newUser.facebook.picture  = profile.photos[0].value;

          newUser.save(function(err) {
            if (err)
              throw err;

            return done(null, newUser);
          });
        }
      });
    });
  }));
};