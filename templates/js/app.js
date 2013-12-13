'use strict';

angular.module('<%= appname %>', [

  // Vendor dependencies.
  <%= angularModules %>

  // Application modules.
])

  // App configuration.
  .config(function ($urlRouterProvider) {

    // Default application's route.
    $urlRouterProvider.otherwise('/main');
  });
