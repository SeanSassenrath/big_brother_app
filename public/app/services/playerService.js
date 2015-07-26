angular.module('playerService', [])

.factory('Player', function($http) {

  var playerFactory = {};

  // get a single player
  playerFactory.get = function() {
    return $http.get('/api/profile');
  };

  // get all players
  playerFactory.get = function() {
    return $http.get('/api/players');
  };

  // get current title holder players
  playerFactory.get = function() {
    return $http.get('/api/current_title_holders');
  };

  // get current season players
  playerFactory.get = function() {
    return $http.get('/api/current_season');
  };

  // create a player
  playerFactory.create = function(playerData) {
    return $http.post('/api/players/', playerData);
  };

  // update a player
  playerFactory.update = function(id, playerData) {
    return $http.put('/api/players' + id, playerData);
  };

  // delete a player
  playerFactory.update = function(id) {
    return $http.delete('/api/players' + id);
  };

  return playerFactory;

});