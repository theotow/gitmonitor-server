module.exports = function(app) {
  var Notification = app.models.notification;
  var Application = app.models.application;
  var PushModel = app.models.push;

  function startPushServer() {

    // Add our custom routes
    var badge = 1;
    app.post('/notify/:id', function(req, res, next) {
      var note = new Notification({
        expirationInterval: 3600, // Expires 1 hour from now.
        badge: badge++,
        alert: '\uD83D\uDCE7 \u2709 ' + 'Hello',
        messageFrom: 'Ray'
      });

      PushModel.notifyById(req.params.id, note, function(err) {
        if (err) {
          console.error('Cannot notify %j: %s', req.params.id, err.stack);
          next(err);
          return;
        }
        console.log('pushing notification to %j', req.params.id);
        res.send(200, 'OK');
      });
    });

    PushModel.on('error', function(err) {
      console.error('Push Notification error: ', err.stack);
    });

    PushModel.on('feedback', function(devices) {
      console.log('Push feedback: ', devices);
    });

    // Pre-register an application that is ready to be used for testing.
    // You should tweak config options in ./config.js

    var config = require('./config');

    var gitmonitorApp = {
      id: config.id,
      userId: 'strongloop',
      name: config.appName,

      description: 'LoopBack Push Notification Demo Application',
      pushSettings: {
        apns: {
          certData: config.apnsCertData,
          keyData: config.apnsKeyData,
          // production: true, // if production
          feedbackOptions: {
            batchFeedback: true,
            interval: 60
          }
        }
      }
    };

    updateOrCreateApp(function(err, appModel) {
      if (err) {
        throw err;
      }
      console.log('Application id: %j', appModel.id);
    });

    //--- Helper functions ---
    function updateOrCreateApp(cb) {
      Application.findOne({
          where: {
            id: gitmonitorApp.id
          }
        },
        function(err, result) {
          if (err) cb(err);
          if (result) {
            console.log('Updating application: ' + result.id);
            delete gitmonitorApp.id;
            result.updateAttributes(gitmonitorApp, cb);
          } else {
            return registerApp(cb);
          }
        });
    }

    function registerApp(cb) {
      console.log('Registering a new Application...');
      // Hack to set the app id to a fixed value so that we don't have to change
      // the client settings
      Application.beforeSave = function(next) {
        if (this.name === gitmonitorApp.name) {
          this.id = gitmonitorApp.id;
        }
        next();
      };
      Application.register(
        gitmonitorApp.userId,
        gitmonitorApp.name, {
          description: gitmonitorApp.description,
          pushSettings: gitmonitorApp.pushSettings
        },
        function(err, app) {
          if (err) {
            return cb(err);
          }
          return cb(null, app);
        }
      );
    }
  }

  startPushServer();
};
