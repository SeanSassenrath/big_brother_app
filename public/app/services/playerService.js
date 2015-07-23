angular.module('playerService', [])

.factory('Player', function($http) {

  var playerFactory = {};

  // get a single user
  userFactory.get = function() {
    return $http.get('/api/profile');
  };

  // get all users
  userFactory.get = function() {
    return $http.get('/api/users');
  };

  // create a user
  userFactory.create = function(userData) {
    return $http.post('/api/users/', userData);
  };

  // update a user
  userFactory.update = function(id, userData) {
    return $http.put('/api/users' + id, userData);
  };

  // delete a user
  userFactory.update = function(id) {
    return $http.delete('/api/users' + id);
  };

  return userFactory;

});