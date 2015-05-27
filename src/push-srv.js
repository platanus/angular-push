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
      $rootScope.on('$cordovaPush:notificationReceived', function(event, notification){
        if (ionic.Platform.isAndroid()) androidPushReceived(event, notification);
        cb(notification);
      });
    }
 
    // returns an object to the callback with source and token properties
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
        alert: true,
      };
 
      $cordovaPush.register(config).then(function(result) {
        setToken(result.deviceToken);
        if (regCallback !== undefined) {
          regCallback({
            source: 'ios',
            token: result.deviceToken
          });
        }
      }, function(err) {
        if (errorCallback !== undefined) {
          errorCallback(err);
        }
        console.log('Registration error on IOS: ', err);
      });
 
    }
 
    // Inits the Android registration
    // NOTICE: This will not set the token inmediatly, it will come
    // on the androidPushReceived
    function registerAndroid() {
      var config = {
        senderID: gcmSenderId
      };
 
      // PushPlugin's telerik only register if necesary or when upgrading app
      $cordovaPush.register(config).then(function(result) {
        console.log('Registration requested!');
      }, function(err) {
        console.log('Error registering on Android', err);
      });
 
    }
 
    // Process incoming push messages from android
    function androidPushReceived(event, notification) {
      if(notification.event == 'registered') {
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
