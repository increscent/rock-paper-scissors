'use strict';

// Declare app level module which depends on views, and components
angular.module('RPS', [
  'ngRoute',
  'RPS.join',
  'RPS.play',
  'RPS.lose',
  'RPS.win',
  'RPS.dataService'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/join'});
}]);
