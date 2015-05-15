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
      this.getGcmSenderId = function(value) {
        return gcmSenderId;
      };

      this.getLocalStorageKey = function(value) {
        return localStorageKey;
      };
    }

    this.$get = function() {
      return new PushConfig();
    };
  }
}());

