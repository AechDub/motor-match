function VinEntryCtrl ($rootScope, vehicleFactory, $scope, $state, $timeout, Constants) {
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
