(function() {
  'use strict';

  angular.module('PlPush')
  .factory('LocalDataSrv', function() {
    var eraseKey = function(_key) {
      delete window.localStorage[_key];
    };

    var getKey = function(_key) {
      return localStorage.getItem(_key);
    };

    var isKeySet = function(_key) {
      return !!localStorage.getItem(_key);
    };

    var setKey = function(_key, _value) {
      localStorage.setItem(_key, _value);
    };

    return {
      setKey: setKey,
      getKey: getKey,
      isKeySet: isKeySet,
      eraseKey: eraseKey
    };
  });

})();
