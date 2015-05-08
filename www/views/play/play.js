'use strict';

angular.module('RPS.play', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/play', {
    templateUrl: 'views/play/play.tpl.html',
    controller: 'PlayCtrl'
  });
}])

.controller('PlayCtrl', ['$scope', '$http', '$location', '$timeout', 'dataService', function($scope, $http, $location, $timeout, dataService) {
  if (!dataService.initial_players.length) $location.path('/join');
  $scope.players = dataService.current_players;
  $scope.status = 'pick';
  $scope.username = dataService.username;

  $scope.pick = function (choice) {
    $scope.status = 'wait';
    $http.post('/turn', {move: choice}, {timeout: 10000000})
    .success( function (data) {
      if (data.error) {
        alert(data.error);
      } else {
        $scope.status = 'result';
        console.log(data);
        $scope.players = data.players;
        $scope.losers = data.losers;
        $scope.moves = data.moves;
        dataService.current_players = data.players;
        $timeout( function () {
          if ($scope.losers.indexOf(dataService.username) !== -1) {
            $location.path('/lose');
          } else if ($scope.players.length === 1) {
            $location.path('/win');
          } else {
            $scope.status = 'pick';
          }
        }, 5000);
      }
    });
  };
}]);
