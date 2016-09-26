function range () {
  return function (items, key, greaterThan, lessThan) {
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

