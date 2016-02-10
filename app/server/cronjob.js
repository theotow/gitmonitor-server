#!/usr/bin/env node
var job = require('./job');
var config = require('./config');
var app = require('./server');
var async = require('async');
var q = async.queue(worker, 2);
q.pause();
if(!module.parent){
  populate(new Date(), config.notifyAfterSeconds * 1000, q, () => {
    var length = q.length();
    if(length === 0){
      return finish();
    }
    q.resume();
    console.log('filled queue', length);
  });
  q.drain = finish;
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

						// set repo notified
	          app.loopback.getModel('Repo').findById(repo.id, function(err, repo){
	            repo.updateAttributes({notified: true},function(err, data){});
	          });
          });
      });
      cb();
    });
  });
}

// kill
function finish(){
  console.log('finished');
  process.exit(0);
}

// process notifications
function worker(task, cb){
	console.log('nofity', task.installation, task.notification)
  job.sendNotification(task.installation, task.notification, cb);
}

module.exports = {
  populate: populate
}
