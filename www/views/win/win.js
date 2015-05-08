'use strict';

angular.module('RPS.win', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/win', {
    templateUrl: 'views/win/win.tpl.html',
    controller: 'WinCtrl'
  });
}])

.controller('WinCtrl', ['$scope', 'dataService', function($scope, dataService) {
  $scope.username = dataService.username;
}]);
