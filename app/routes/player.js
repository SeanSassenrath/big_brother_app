var express       = require('express');
var app           = express();
var Player         = require('../models/player.js')

module.exports = function(app) {

  app.get('/api/players', function(req, res) {
    Player.find(function(err, users) {
      if(err) res.send(err);

      res.json(users);
    });
  });

  app.get('/api/players/:player_id', function(req, res) {
      Player.findById(req.params.player_id, function(err, player) {
        if(err) res.send(err);
        res.json(player);
      });
    });

  // !_!_!_! ADD LOG IN AUTH TO POST ROUTE !_!_!_!
  app.post('/api/players', function(req, res) {
    var player = new Player();

    player.name     = req.body.name
    player.bio      = req.body.bio
    player.title    = req.body.title
    player.picture  = req.body.picture
    player.out      = req.body.out
    player.season   = req.body.season

    player.save(function(err) {
      if(err)
        res.send(err);
      res.json({ message: 'Player added!', data: player});
    });
  });

  // !_!_!_! ADD LOG IN AUTH TO PUT ROUTE !_!_!_!
  app.put('/api/players/:player_id', function(req, res) {
    Player.findById(req.params.player_id, function(err, player) {
      if(err) res.send(err);

      if(req.body.name) player.name     = req.body.name;
      if(req.body.bio) player.bio      = req.body.bio;
      if(req.body.title) player.title    = req.body.title;
      if(req.body.picture) player.picture  = req.body.picture;
      if(req.body.out) player.out      = req.body.out;
      if(req.body.season) player.season   = req.body.season;

      player.save(function(err) {
        if(err) res.send(err);

        res.json({ message: player });
      });
    });
  });

  app.delete('/api/players/:player_id', function(req, res) {
    Player.remove({
      _id: req.params.player_id
    }, function(err, player) {
      if(err) return res.send(err);
      res.json({ message: 'Player Deleted'})
    });
  });

};