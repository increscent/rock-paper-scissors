'use strict';

angular.module('RPS.join', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/join', {
    templateUrl: 'views/join/join.tpl.html',
    controller: 'JoinCtrl'
  });
}])

.controller('JoinCtrl', ['$scope', '$http', '$location', 'dataService', function($scope, $http, $location, dataService) {
  $scope.min_players = 2;

  $scope.join = function (username, min_players) {
    $scope.loading = true;
    $http.post('/joingame', {id: username, min_players: min_players}, {timeout: 1000000})
    .success( function (data) {
      if (data.error) {
        alert(data.error)
        $scope.loading = false;
      } else {
        dataService.initial_players = data.players;
        dataService.current_players = data.players;
        dataService.username = username;
        $location.path('/play');
      }
    });
  };
}]);
