Platanus Angular Push
============

Dead-easy push notification handling with the help of our PushNotification plugin and ngCordova. Provides a simple interface with which to register devices and act on incoming notifications.

## Installation

First of all, make sure you have installed ```ngCordova``` and the [Platanus ```PushNotification``` plugin](https://github.com/platanus/PushNotification) in your app.

Then, install the library via Bower.

```shell
$ bower install platanus-angular-push
```

Finally, include the JS file in your HTML and the `PlPush` dependency in your Angular app.

```javascript
angular.module('yourapp', ['PlPush']);
```

## How to use

This library includes the `PushSrv` service, which you will use to register devices and handle incoming notifications. The most common use case, for both Android and iOS, would be:

```javascript
var app = angular.module('myApp', ['PlPush']);

app.config(function(PushConfigProvider){
  PushConfigProvider.setGcmSenderId('YOUR GOOGLE PUSH SENDER ID');

  // optional, more information in https://github.com/phonegap/phonegap-plugin-push
  PushConfigProvider.setOptions({
    ios: {
      sound: false
    },
    android: {
      vibrate: true
    }
  });
});

app.run(function(PushSrv){
  PushSrv.ensureRegistration(function(){
    console.info('Registered! Push Token is ' + PushSrv.getToken());
  }, function(){
    console.error('Error when registering device.');
  });

  PushSrv.onMessage(function(notification){
    // Do as you please with the notification object.
  });
});

```

### Registering devices

**PushSrv.ensureRegistration(success, error)**

This function will register the app, only if necessary. It optionally accepts two callbacks, one for success and one in case of an error. It automatically handles differences in the process between Android & iOS. If succesful, the device is now ready to receive push notifications.

On Android you will need to provide your GCM Sender ID. Read the Config section of this readme to know how to do so.

### Retrieving the Push Token

**PushSrv.getToken()**

This is the token generated through the registration process, which you'll need to send notifications to this device. You might need to store it in a database, for example. For iOS, this is the APNS Device Token, while for Android, it is the GCM Registration ID. This token is saved in LocalStorage for further use.

### Handling incoming notifications

**PushSrv.onMessage(callback)**

This method receives a callback which is passed the `message` argument, containing the notification's data.

## Android GCM

On Android, you will need to define your Google Cloud Messaging Sender ID in order to register devices. As shown above in the example, use the `PushConfigProvider` to set the GCM Sender ID.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

## Credits

Thank you [contributors](https://github.com/platanus/angular-auth/graphs/contributors)!

<img src="http://platan.us/gravatar_with_text.png" alt="Platanus" width="250"/>

angular-push is maintained by [platanus](http://platan.us).

## License

AngularPush is © 2015 platanus, spa. It is free software and may be redistributed under the terms specified in the LICENSE file.
