var mongoose = require('mongoose');

var playerSchema = new mongoose.Schema({
  name: String,
  age: String,
  bio: String,
  title: String,
  picture: String,
  out: Boolean,
  season: Number
})

var Player = mongoose.model('Player', playerSchema);

module.exports = Player