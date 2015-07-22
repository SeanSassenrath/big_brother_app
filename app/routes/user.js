var express       = require('express');
var app           = express();
var User          = require('../models/user.js');

module.exports = function(app, passport) {

  // Routes

  // app.get('/', function(req, res) {
  //   res.send('Fantasy Big Brother Home Page')
  // });

  // !_!_!_! ADD LOG IN AUTH TO PROFILE ROUTE !_!_!_!
  app.get('/api/profile', function(req, res) {
    res.json({ user: req.user })
  });

  // !_!_!_! ADD LOGIN ROUTES !_!_!_!

  // api/users Routes

  app.get('/api/users', function(req, res) {
    User.find(function(err, users) {
      if(err) res.send(err);

      res.json(users);
    });
  });

  app.post('/api/users',passport.authenticate('local-signup', {
    successRedirect: '/api/profile',
    failureRedirect: '/',
    failureFlash: true
  }));

  // !_!_!_! ADD LOG IN AUTH TO PUT ROUTE !_!_!_!
  app.put('/api/users/:user_id', function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if(err) res.send(err);

      user.local.email = req.body.email;
      user.facebook.email = req.body.email;

      user.save(function(err) {
        if(err) res.send(err);

        res.json({ message: user });
      });
    });
  });

  app.delete('/api/users/:user_id', function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if(err) return res.send(err);
      res.json({ message: 'User Deleted'})
    });
  });

  app.get('/api/users/:user_id', function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if(err) res.send(err);
        res.json(user);
      });
    });

  // facebook
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email'}));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      session: false,
      successRedirect: '/api/profile',
      failureRedirect: '/'
    }));

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('//:');
  });
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if a user is authenticated in the session, then next
  if (req.isAuthenticated())
    return next();
  // if they aren't, redirect them to the home page
  res.redirect('/');
}