#!/usr/bin/env node
var job = require('./job');
var config = require('./config');
var async = require('async');
var q = async.queue(worker, 2);
if(!module.parent){
  populate(new Date(), config.notifyAfterSeconds * 1000, q, () => {
    console.log('filled queue');
  });
}

function populate(time, maxtime, queue, cb){

  job.getNotifieables(time, maxtime, function(err, repos){
    if(err) return console.log(err);

    // get subscribed devices / users
    job.getInstallationOfRepo(repos, function(err, installations){
      if(err) return console.log(err);
      repos.forEach(function(repo, index){
          installations[index].forEach(function(installation, index){

            // gen notification and push to queue
            var notification = job.genNotification(repo);
            queue.push({
              notification: notification,
              installation: installation,
              repo: repo
            });
          });
          // set repo notified
          app.loopback.getModel('Repo').findOne({id: repo.id}, function(err, repo){
            repo.updateAttributes({notified: true},function(err, data){
            });
          });
      });
      cb();
    });
  });
}

// process notifications
function worker(task, cb){
  job.sendNotification(task.installation, task.notification, cb);
}

module.exports = {
  populate: populate
}
