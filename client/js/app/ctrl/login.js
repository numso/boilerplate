/* global angular */
angular.module('app').controller('loginCtrl',
  function ($scope, nav) {
    'use strict';

    $scope.title = 'App';
    $scope.nav = nav;
    $scope.msg = 'Login';
  }
);
