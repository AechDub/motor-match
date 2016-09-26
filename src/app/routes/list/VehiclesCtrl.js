function VehiclesCtrl (vehicleFactory, $scope) {
  var ctrl = this

  ctrl.init = function () {
    $scope.processing = true
    $scope.mpg = 5

    vehicleFactory
      .getVehicles()
      .then(function (res) {
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
