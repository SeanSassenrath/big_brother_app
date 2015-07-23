var express       = require('express');
var app           = express();
var jwt           = require('jsonwebtoken');
var expressJwt    = require('express-jwt')
var User          = require('../models/user.js');
var config        = require('../../config/settings.js')
var BearerStrategy    = require('passport-http-bearer').Strategy;

module.exports = function(app, passport) {

  // Routes

  // app.get('/', function(req, res) {
  //   res.send('Fantasy Big Brother Home Page')
  // });
  // app.use('/api', function(req, res, next) {
  //   var token = req.body.token || req.query.token || req.headers['x-access-token'];

  //   if (token) {
  //     jwt.verify(token, config.secret, function(err, decoded) {
  //       if(err) {
  //         return res.status(403).send({
  //           sucess: false,
  //           message: 'Token auth failed'
  //         });
  //       } else {
  //         req.decoded = decoded;
  //         next();
  //       }
  //     });
  //   } else {
  //     return res.status(403).send({
  //       success: false,
  //       message: 'No token provided'
  //     });
  //   }
  // })

  app.get('/profile', passport.authenticate('bearer', { session: false }),
    function(req, res) {
      res.send("Logged in as " + req.user.facebook.name)
    }
  );

  app.post('/api/authenticate', function(req, res) {
    console.log(req.body.email)
    User.findOne({
      'local.email': req.body.email
    }, function(err, user) {

      console.log('***** ' + user)
      if(err) throw err;

      if(!user) {
        res.json({ success: false, message: 'Auth failed. User not found'});
      } else if (user) {
        if(user.local.password != req.body.password) {
          res.json({ success: false, message: 'Auth failed. Wrong password.' });
        } else {

          console.log(user)

          // var userNoPassword = {
          //   id: user._id,
          //   name: user.username
          // }
          var token = jwt.sign(user, config.secret, {
                    expiresInMinutes: 5 // expires in 24 hours
          });

          // var token = jwt.sign(userNoPassword, app.get('mysecret'), {
          //   expiresInMinutes: 2//43800 // 730 hours, about a month
          // });

          res.json({
            success: true,
            message: 'Token issued',
            token: token
          });
        }
      }
    });
  });

  // !_!_!_! ADD LOG IN AUTH TO PROFILE ROUTE !_!_!_!
  app.get('/api/profile', function(req, res) {
    res.json({ user: req.user })
  });

  // !_!_!_! ADD LOGIN ROUTES !_!_!_!

  // api/users Routes

  app.get('/api/users',
   function(req, res) {
    User.find(function(err, users) {
      if(err) res.send(err);

      res.json(users);
    });
  });

  app.post('/api/users',passport.authenticate('local-signup', {
    successRedirect: '/api/users',
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
  app.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: []}));

  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      session: false,
      // successRedirect: '/api/profile',
      failureRedirect: '/'}),
    function(req, res) {
      console.log('!!!!' + req.user)
      res.redirect("/profile?access_token=" + req.user.facebook.token);
    }
  );

  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
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