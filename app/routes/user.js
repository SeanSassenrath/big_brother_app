var jwt           = require('jsonwebtoken');
var User          = require('../models/user.js');
var config        = require('../../config/settings.js')
var BearerStrategy    = require('passport-http-bearer').Strategy;

module.exports = function(app, express) {

  // Routes

  // Auth Route - Providing Tokens
  app.post('/authenticate', function(req, res) {
    console.log(req.body.password)
    User.findOne({
      'profile.email': req.body.email
    }, function(err, user) {

      console.log('***** ' + user)
      if(err) throw err;

      if(!user) {
        res.json({ success: false, message: 'Auth failed. User not found'});
      } else if (user) {

        var validPassword = user.comparePassword(req.body.password);
        if(!validPassword) {
          res.json({ success: false, message: 'Auth failed. Wrong password.' });
        } else {

          console.log(user)

          var userNoPassword = {
            id: user._id,
            username: user.profile.username
          }
          var token = jwt.sign(userNoPassword , config.secret, {
                    expiresInMinutes: 5 // expires in 24 hours
          });

          // var token = jwt.sign(userNoPassword, app.get('mysecret'), {
          //   expiresInMinutes: 2//43800 // 730 hours, about a month
          // });

          console.log('token issued')

          res.json({
            success: true,
            message: 'Token issued',
            token: token
          });
        }
      }
    });
  });

  app.use('/api', function(req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {
      jwt.verify(token, config.secret, function(err, decoded) {
        if(err) {
          return res.status(403).send({
            sucess: false,
            message: 'Token auth failed'
          });
        } else {
          req.decoded = decoded;
          next();
        }
      });
    } else {
      return res.status(403).send({
        success: false,
        message: 'No token provided'
      });
    }
  })

  // Facebook Auth Testing
  // app.get('/fbprofile', passport.authenticate('bearer', { session: false }),
  //   function(req, res) {
  //     res.send("Logged in as " + req.user.facebook.name)
  //   }
  // );

  // API Routes
  var apiRouter = express.Router();

  apiRouter.get('/users', function(req, res) {
    User.find(function(err, users) {
      if(err) res.send(err);

      res.json(users);
    });
  });

  apiRouter.get('/users/:user_id', function(req, res) {
      User.findById(req.params.user_id, function(err, user) {
        if (err) res.send(err);
        res.json(user);
      });
    });

  apiRouter.get('/me', function(req, res) {
    res.send(req.decoded);
  });

  apiRouter.post('/users', function(req, res) {

    // find error code for dup email
    User.find({
      $or:[{'profile.email': req.body.email}, {'profile.username': req.body.username}]}, function(err, user) {

        if (user.length > 1) {
          if (user[0].profile.email === req.body.email && user[1].profile.username === req.body.username) {
            res.json({ success: false, message: "This username and email have already been taken" })
          } else if (user[1].profile.email === req.body.email && user[0].profile.username === req.body.username) {
            res.json({ success: false, message: "This username and email have already been taken" })
          }
        } else if (user.length === 1) {
          if (user[0].profile.email === req.body.email) {
            res.json({ success: false, message: "This email has already been taken" })
          } else if (user[0].profile.username === req.body.username) {
            res.json({ success: false, message: "This username has already been taken" })
          }
        } else {
          var user = new User();

          user.profile.email = req.body.email;
          user.profile.username = req.body.username;
          user.profile.password = req.body.password;

          user.save(function(err) {
            if(err) {
              if(err.code == 11000)
                return res.json({ success: false, message: 'A user with that username already exists' });
              else
                return res.send(err);
            }
            res.redirect('/')
          });
        }

        console.log(user)

    })
  })

  // apiRouter.post('/users',passport.authenticate('local-signup', {
  //   session: false,
  //   successRedirect: '/',
  //   failureRedirect: '/',
  //   failureFlash: true
  // }));

  apiRouter.put('/users/:user_id', function(req, res) {
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

  apiRouter.delete('/users/:user_id', function(req, res) {
    User.remove({
      _id: req.params.user_id
    }, function(err, user) {
      if(err) return res.send(err);
      res.json({ message: 'User Deleted'})
    });
  });

  // facebook
  // app.get('/auth/facebook', passport.authenticate('facebook', { session: false, scope: []}));

  // app.get('/auth/facebook/callback',
  //   passport.authenticate('facebook', {
  //     session: false,
  //     failureRedirect: '/'}),
  //   function(req, res) {
  //     console.log('!!!!' + req.user)
  //     res.redirect("/profile?access_token=" + req.user.facebook.token);
  //   }
  // );

  // app.get('/logout', function(req, res) {
  //   req.logout();
  //   res.redirect('/');
  // });

  return apiRouter
}