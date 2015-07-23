var LocalStrategy     = require('passport-local').Strategy;
var FacebookStrategy  = require('passport-facebook').Strategy;
var User              = require('../app/models/user');
var configAuth        = require('./auth');
var BearerStrategy    = require('passport-http-bearer').Strategy;

// expose this function to our server
module.exports = function(passport) {
  // passport session setup

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

          console.log("what i'm looking for " + user)
          var newUser             = new User();

          newUser.local.email     = email;
          newUser.local.password  = newUser.generateHash(password);
          // newUser.profile.username = req.username;

          newUser.save(function(err) {
            if (err)
              throw err;
            return done(null, newUser);
          });
        }
      });
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

  // bearer
  passport.use(
      new BearerStrategy(
          function(token, done) {
              User.findOne({ 'facebook.token': token }, // see if you can put this in the header and not in the url
                  function(err, user) {
                      if(err) {
                        console.log('error with' + user)
                          return done(err)
                      }
                      if(!user) {
                        console.log('NO USER!!!')
                          return done(null, false)
                      }

                      return done(null, user, { scope: 'all' })
                  }
              );
          }
      )
  );
};