;(function(){
  angular.module('app')
    .constant('Constants', {
      assetsDir: '/assets',
      edmundsApiUrl: 'https://api.edmunds.com/api/vehicle/v2/',
      edmundsApiKey: '&api_key=vv77bjbsmujkk4gew6nz3nqp',
      saveMessage: 'Your {item} was saved!  Please proceed to the {page} page.  You will be redirected after {time} seconds',
      saveFailed: 'Your {item} failed to save.  This is most likely due to {description}.',
      apiUrl: 'http://motor-match-api.herokuapp.com/api/v1/'
    });
})();