function vehicleFactory ($http, Constants) {
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

    return $http(req)
      .then(saveVehicleDetailsComplete, saveVehicleDetailsFailed)

    function saveVehicleDetailsComplete (response) {
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
