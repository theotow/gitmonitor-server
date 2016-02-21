module.exports = function(app) {
  var Notification = app.models.notification;
  var Application = app.models.application;

  function startPushServer() {

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
          production: false, // if production
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
      Application.observe('before save', function(modelInstance, next) {
        if (modelInstance.instance) {
          if (modelInstance.instance.name === gitmonitorApp.name) {
            modelInstance.instance.id = gitmonitorApp.id;
          }
        } else {
          if (modelInstance.data.name === gitmonitorApp.name) {
            modelInstance.data.id = gitmonitorApp.id;
          }
        }
        next();
      });
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
