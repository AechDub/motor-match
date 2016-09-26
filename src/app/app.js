function run ($ionicPlatform) {
  $ionicPlatform.ready(function () {
    if (window.cordova) {
      window.open = cordova.InAppBrowser.open
    }

    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false)
      cordova.plugins.Keyboard.disableScroll(true)
    }

    if (window.StatusBar) {
      StatusBar.styleLightContent()
    }
  })
}

function config ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $ionicNativeTransitionsProvider) {
  $stateProvider
    .state('app', {
      abstract: true,
      url: '/app',
      templateUrl: 'menu/menu.html'
    })
    .state('app.welcome', {
      url: '/welcome',
      templateUrl: 'routes/welcome/welcome.html'
    })
    .state('app.vin', {
      url: '/vin',
      templateUrl: 'routes/vin/entry.html',
      controller: 'VinEntryCtrl as vinEntryCtrl'
    })
    .state('app.list', {
      url: '/list',
      templateUrl: 'routes/list/vehicles.html',
      controller: 'VehiclesCtrl as vehiclesCtrl'
    })

  $ionicNativeTransitionsProvider.setDefaultTransition({ type: 'none' })
  $urlRouterProvider.otherwise('/app/welcome')
  $ionicConfigProvider.views.transition('none')
  $ionicConfigProvider.views.maxCache(0)
}

angular.module('app', ['ionic', 'ngCordova', 'ionic-native-transitions'])
  .run(run)
  .config(config)
