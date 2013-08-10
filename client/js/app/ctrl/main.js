/* global angular */
angular.module('app').controller('mainCtrl',
  function ($scope, nav) {
    'use strict';

    $scope.title = 'App';
    $scope.nav = nav;
    $scope.msg = 'Main';
  }
);
