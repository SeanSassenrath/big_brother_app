var express       = require('express');
var app           = express();
var User          = require('../models/user.js')

module.exports = function(app, passport) {

  // Routes

  app.get('/', function(req, res) {
    res.send('Fantasy Big Brother Home Page')
  });

  // api/users Routes

  app.get('/api/users', function(req, res) {
    User.find(function(err, users) {
      if(err) res.send(err);

      res.json(users);
    });
  });

  app.post('/api/users',passport.authenticate('local-signup', {
    successRedirect: '/users',
    failureRedirect: '/',
    failureFlash: true
  }));

  app.put('/api/users/:user_id', function(req, res) {
    User.findById(req.params.user_id, function(err, user) {
      if(err) res.send(err);

      user.local.email = req.body.email;

      user.save(function(err) {
        if(err) res.send(err);

        res.json({ message: user });
      });
    });
  });

  app.get('/api/users/:user_id', function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if(err) res.send(err);
        res.json(user);
      });
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