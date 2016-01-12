var models = require('./server').models;
var config = require('./config');
var async = require('async');
var moment = require('moment');

// get repos which are not synced
function getNotifieables(time, maxdiff, cb){
  models.Repo.find({ where: {
      notified: false,
      isClean: false
  }}, function(err, data){
    if(err) return cb(err);
    var res = _.filter(data, function(item){
      return (moment(time).diff(item.updateTime) > maxdiff);
    });
    cb(null, res);
  });
}

// build the notification
function genNotification(repo){
  return new models.notification({
    expirationInterval: 3600, // Expires 1 hour from now.
    alert: 'Repo was not pushed - ' + repo.name,
  });
}

// get one or more installations of a repo
function getInstallationOfRepo(repos, cb){
  var res = [];

  function getInstallations(Repo, cb){
    Repo.installations({}, cb);
  }

  async.map(repos, getInstallations, cb);
}

// send to people
function sendNotification(installation, notification, cb){

  models.push.notifyById(installation.id, notification, cb);
}

module.exports = {
  getNotifieables: getNotifieables,
  getInstallationOfRepo: getInstallationOfRepo,
  genNotification: genNotification,
  sendNotification: sendNotification
}
