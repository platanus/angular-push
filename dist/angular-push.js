angular.module('PlPush', ['ngCordova']);
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

(function() {
  'use strict';

  angular
    .module('PlPush')
    .provider('PushConfig', PushConfigProvider);

  function PushConfigProvider() {
    var gcmSenderId = null;
    var localStorageKey = 'plPush.pushToken';

    this.setGcmSenderId = function(value) {
      gcmSenderId = value;
    };

    this.setLocalStorageKey = function(value) {
      localStorageKey = value;
    };

    function PushConfig() {
      this.getGcmSenderId = function() {
        return gcmSenderId;
      };

      this.getLocalStorageKey = function() {
        return localStorageKey;
      };
    }

    this.$get = function() {
      return new PushConfig();
    };
  }
}());


(function() {
  'use strict';

  angular
    .module('PlPush')
    .service('PushSrv', PushSrv);

  PushSrv.$inject = ['$rootScope', 'LocalDataSrv', 'PushConfig', '$cordovaPush'];

  function PushSrv($rootScope, LocalDataSrv, PushConfig, $cordovaPush) {
    var regCallback;
    var errorCallback;
    var gcmSenderId = PushConfig.getGcmSenderId();
 
    var service = {
      ensureRegistration: ensureRegistration,
      getToken: getToken,
      onMessage: onMessage
    };
 
    return service;
 
    function setToken(token) {
      LocalDataSrv.setKey(PushConfig.getLocalStorageKey(), token);
    }
 
    function getToken() {
      return LocalDataSrv.getKey(PushConfig.getLocalStorageKey(), '');
    }
 
    function onMessage(cb) {
      $rootScope.$on('$cordovaPush:notificationReceived', function(event, notification){
        if (ionic.Platform.isAndroid()) androidPushReceived(event, notification);
        cb(notification);
      });
    }
 
    function ensureRegistration(cb, errorCb) {
      regCallback = cb;
      errorCallback = errorCb;
 
      document.addEventListener('deviceready', function(){
        if (ionic.Platform.isAndroid()) registerAndroid();
        if (ionic.Platform.isIOS()) registerIOS();
      });
 
      return this;
    }
 
    function registerIOS() {
      var config = {
        badge: true,
        sound: true,
        alert: true
      };
 
      $cordovaPush.register(config).then(function(result) {
        setToken(result);
        if (regCallback !== undefined) {
          regCallback({
            source: 'ios',
            token: result
          });
        }
      }, function(err) {
        if (errorCallback !== undefined) {
          errorCallback(err);
        }
        console.log('Registration error on IOS: ', err);
      });
 
    }
 
    function registerAndroid() {
      var config = {
        senderID: gcmSenderId
      };
 
      $cordovaPush.register(config).then(function(result) {
        console.log('Registration requested!');
      }, function(err) {
        console.log('Error registering on Android', err);
      });
 
    }
 
    function androidPushReceived(event, notification) {
      if(notification.event === 'registered') {
        if (notification.regid.length > 0 ) {
          setToken(notification.regid);
          if (regCallback !== undefined) {
            regCallback({
              source: 'android',
              token: notification.regid
            });
          }
        }
      }
    }
  }

})();
