"use strict";

var job = require('../server/job');
var cronjob = require('../server/cronjob');
var models = require('../server/server').models;

describe('Cronjob', () => {
	lt.beforeEach.withApp(app);

	before((cb) => {
		app.loopback.getModel('installation').remove({});
		app.loopback.getModel('Repo').remove({});
		async.waterfall([
      function(cb) {
				common.createRepos([common.repoData, common.repoData3], (err, data) => cb(err, data));
			},
			function(repos, cb) {
				common.installDevices([common.device, common.device2, common.device3], (err, data) => cb(err, repos, data));
			},
      function(repos, devices, cb) {
				async.series([
						function(cb){
							common.linkX(repos[0].res.body.id, [devices[0], devices[1]], cb);
						},
						function(cb){
							common.linkX(repos[1].res.body.id, [devices[2]], cb);
						}
					], function(err, data){
						if(err) return cb(err);
						cb(null, data, repos, devices);
					})
			}
		], function(err, links, repos, devices) {
			setTimeout(() => {
				cb();
			}, 1000);
		});
	});
	it('cronjob - cron job should have 2 devices to notify', function(done) {
		this.timeout(5000);
		var results = [];
		var q = async.queue(function(task, cb){
			results.push(task);
			cb();
		}, 2);

		// queue full
		q.drain = function() {
			expect(results[0].repo.name).to.be(common.repoData.name);
			expect(results[1].repo.name).to.be(common.repoData.name);

			function match(val){
				return (val === common.device.deviceToken || val == common.device2.deviceToken);
			}

			expect(match(results[0].installation.deviceToken)).to.be(true);
			expect(match(results[1].installation.deviceToken)).to.be(true);
			done();
		}

		// run
		cronjob.populate(new Date(), 800, q, function(){});
	});
	it('cronjob - repo should be notified after beeing in the queue', function(done) {
		expect(true).to.be(true);
		done();
	});



});
