(function() {
  'use strict';

  angular
    .module('PlPush')
    .service('PushSrv', PushSrv);

  PushSrv.$inject = ['$rootScope', 'LocalDataSrv', 'PushConfig', '$cordovaPushV5'];

  function PushSrv($rootScope, LocalDataSrv, PushConfig, $cordovaPushV5) {
    var regCallback;
    var errorCallback;
    var gcmSenderId = PushConfig.getGcmSenderId();
    var extendedOptions = PushConfig.getOptions();

    var service = {
      ensureRegistration: ensureRegistration,
      getToken: getToken,
      onMessage: onMessage
    };

    return service;


    function getToken() {
      return LocalDataSrv.getKey(PushConfig.getLocalStorageKey(), '');
    }

    function onMessage(cb) {
      $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, notification){
        $rootScope.$applyAsync(function(){
          cb(notification);
        });
      });
    }

    function ensureRegistration(cb, errorCb) {
      regCallback = cb;
      errorCallback = errorCb;

      document.addEventListener('deviceready', init);

      return this;
    }

    /// Private

    function init(){
      var config = getConfig();

      $cordovaPushV5.initialize(config).then(register);
      $cordovaPushV5.onNotification();
      $cordovaPushV5.onError();
    }

    function register() {
      $cordovaPushV5.register().then(function(result) {
        setToken(result);
        if (regCallback !== undefined) {
          regCallback({
            source: ionic.Platform.platform(),
            token: result
          });
        }
      }, function(err) {
        if (errorCallback !== undefined) {
          errorCallback(err);
        }
        console.log('Registration error: ', err);
      });
    }

    function setToken(token) {
      LocalDataSrv.setKey(PushConfig.getLocalStorageKey(), token);
    }

    function getConfig() {
      var platform = ionic.Platform.platform();
      var config, dataConfig = {};

      var iosDefaultConfig = {
        badge: true,
        sound: true,
        alert: true
      };

      var androidDefaultConfig = {
        senderID: gcmSenderId
      };

      switch(platform){
      case 'ios':
        config = angular.extend({}, iosDefaultConfig, extendedOptions.ios);
        break;
      case 'android':
        config = angular.extend({}, androidDefaultConfig, extendedOptions.android);
        break;
      }

      dataConfig[platform] = config;
      return dataConfig;
    }
  }

})();
