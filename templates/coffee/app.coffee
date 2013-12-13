'use strict'

angular.module('<%= appname %>', [

  # Vendor dependencies.
  <%= angularModules %>

  # Application modules.
])

  # App configuration.
  .config ($urlRouterProvider) ->

    # Default application's route.
    $urlRouterProvider.otherwise '/main'
