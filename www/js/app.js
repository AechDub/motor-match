(function () { 'use strict';function run ($ionicPlatform) {
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
})();
(function () { 'use strict';function vehicleFactory ($http, Constants) {
  function getVehicles (params) {
    var req = {
      method: 'GET',
      url: Constants.apiUrl + 'vehicles',
      params: params
    }

    function getVehiclesComplete (response) {
      return response.data.results
    }

    function getVehiclesFailed (error) {
      console.error(error)
    }

    return $http(req)
      .then(getVehiclesComplete, getVehiclesFailed)
  }

  function addVehicle (data) {
    return requestVehicleByVin(data)
  }

  function requestVehicleByVin (vin) {
    var req = {
      method: 'GET',
      url: Constants.edmundsApiUrl + 'vins/' + vin + '?fmt=json' + Constants.edmundsApiKey
    }

    return $http(req)
      .then(requestVehicleByVinComplete, requestVehicleByVinFailed)

    function requestVehicleByVinComplete (response) {
      saveVehicleDetails(response.data)
    }

    function requestVehicleByVinFailed (error) {
      console.error(error)
      return { message: error.data.message }
    }
  }

  function saveVehicleDetails (data) {
    var req = {
      method: 'POST',
      url: Constants.apiUrl + 'vehicles',
      data: {
        type: _.get(data, 'categories.vehicleType', 'N/A'),
        make: _.get(data, 'make.name', 'N/A'),
        model: _.get(data, 'model.name', 'N/A'),
        model_year: _.get(data, 'years.year', null),
        mpg: _.get(data, 'MPG.highway', null),
        vin: _.get(data, 'vin', 'N/A'),
        price: _.get(data, 'price.baseMSRP', null)
      }
    }

    console.log(req)

    return $http(req)
      .then(saveVehicleDetailsComplete, saveVehicleDetailsFailed)

    function saveVehicleDetailsComplete (response) {
      console.log('save response', response)
      return response
    }

    function saveVehicleDetailsFailed (error) {
      console.error(error)
      return { message: Constants.saveFailed.replace('{item}', 'vehicle').replace('{description}', 'a lack of information available.') }
    }
  }

  return {
    getVehicles: getVehicles,
    addVehicle: addVehicle
  }
}

angular
  .module('app')
  .factory('vehicleFactory', vehicleFactory)
})();
(function () { 'use strict';function transitionTo ($ionicNativeTransitions) {
  var directive = {
    link: link,
    restrict: 'A'
  }

  return directive

  function link (scope, el, attrs) {
    var HEADER_PIXEL_HEIGHT = 65
    var DEFAULT_ANIMATION = 'fade'

    el.on('click', function () {
      // four arguments passed to $ionicNativeTransitions.stateGo function
      var stateName = attrs.transitionTo
      var stateParams = {}
      var stateOptions = {}
      var transitionOptions = {}

      // extract desired transition options from attributes. if no attributes provided, default options will be used
      if (attrs.animation) {
        transitionOptions.type = attrs.animation
      } else {
        transitionOptions.type = DEFAULT_ANIMATION
      }

      if (attrs.duration) {
        transitionOptions.duration = attrs.duration
      }

      if (attrs.direction) {
        transitionOptions.direction = attrs.direction
      }

      if (attrs.stateParams) {
        stateParams = JSON.parse(attrs.stateParams)
      }

      // if sliding left or right, keep the header fixed
      if (attrs.animation === 'slide' && (attrs.direction === 'left' || attrs.direction === 'right')) {
        transitionOptions.fixedPixelsTop = HEADER_PIXEL_HEIGHT
      }

      $ionicNativeTransitions.stateGo(stateName, stateParams, stateOptions, transitionOptions)
    })
  }
}

angular
  .module('app')
  .directive(
    'transitionTo',
    transitionTo
  )
})();
(function () { 'use strict';function range () {
  return function (items, key, greaterThan, lessThan) {
    console.log('items', items, ' key', key, ' greaterThan', greaterThan, ' lessThan', lessThan)
    items = items.filter(function (item) {
      greaterThan = greaterThan === undefined ? 0 : greaterThan

      if (lessThan !== undefined) {
        return item[key] >= greaterThan && item[key] < lessThan
      } else {
        return item[key] >= greaterThan
      }
    })

    return items
  }
}

angular
  .module('app')
  .filter('range', range)

})();
(function () { 'use strict';function VinEntryCtrl ($rootScope, vehicleFactory, $scope, $state, $timeout, Constants) {
  var ctrl = this

  ctrl.saveVehicle = function (vin) {
    $scope.processing = true

    vehicleFactory
      .addVehicle(vin)
      .then(function (result) {
        $scope.processed = true
        $scope.processing = false

        if (_.has(result, 'message')) {
          $scope.error = true
          $scope.message = result.message
        } else {
          $scope.success = true
          $scope.message = Constants.saveMessage
                              .replace('{item}', 'vehicle')
                              .replace('{page}', 'vehicle listing')
                              .replace('{time}', '5')

          $timeout(function () {
            $state.go('app.list')
          }, 5000)
        }
      })
  }
}

angular
  .module('app')
  .controller(
    'VinEntryCtrl',
    VinEntryCtrl
  )
})();
(function () { 'use strict';function VehiclesCtrl (vehicleFactory, $scope) {
  var ctrl = this

  ctrl.init = function () {
    $scope.processing = true
    $scope.mpg = 5

    vehicleFactory
      .getVehicles()
      .then(function (res) {
        console.log('getVehicles', res)
        $scope.processing = false
        $scope.vehicles = res
      })
  }

  ctrl.init()
}

angular
  .module('app')
  .controller(
    'VehiclesCtrl',
    VehiclesCtrl
  )
})();