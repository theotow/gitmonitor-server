module.exports = function(Installation) {

  var config = require('../../server/config');

  Installation.observe('before save', function(modelInstance, next) {
    if (modelInstance.instance) {
      modelInstance.instance.appId = config.id;
    } else {
      modelInstance.data.appId = config.id;
    }
    next();
  });
};
