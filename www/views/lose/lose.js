'use strict';

angular.module('RPS.lose', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lose', {
    templateUrl: 'views/lose/lose.tpl.html',
    controller: 'LoseCtrl'
  });
}])

.controller('LoseCtrl', ['$scope', 'dataService', function($scope, dataService) {
  $scope.username = dataService.username;
}]);
