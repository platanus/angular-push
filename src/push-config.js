(function() {
  'use strict';

  angular
    .module('PlPush')
    .provider('PushConfig', PushConfigProvider);

  function PushConfigProvider() {
    var gcmSenderId = null;
    var localStorageKey = 'plPush.pushToken';
    var options = {
      android: {},
      ios: {}
    };

    this.setGcmSenderId = function(value) {
      gcmSenderId = value;
    };

    this.setLocalStorageKey = function(value) {
      localStorageKey = value;
    };

    this.setOptions = function(value) {
      options = value;
    };

    function PushConfig() {
      this.getGcmSenderId = function() {
        return gcmSenderId;
      };

      this.getLocalStorageKey = function() {
        return localStorageKey;
      };

      this.getOptions = function() {
        return options;
      };
    }

    this.$get = function() {
      return new PushConfig();
    };
  }
}());
