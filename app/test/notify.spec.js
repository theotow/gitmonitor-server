"use strict";

var job = require('../server/job');
var models = require('../server/server').models;
var Promise = require('bluebird');
var commonP = Promise.promisifyAll(common);
var asyncWaterfall = Promise.promisify(require('async').waterfall);


describe('Notify', () => {
	lt.beforeEach.withApp(app);

	beforeEach((cb) => {
		app.loopback.getModel('Repo').destroyAll({}, cb); // to make tests atomic
	})

	it('getNotifieables - repos create now or less then 5sec. are not notified', function(done) {
		commonP.createRepoAsync(common.repoData).then(() => {}).delay(100).then(() => {
			job.getNotifieables(new Date(), 1000, (err, data) => {
				expect(data.length).to.be(0);
				done();
			})
		});
	});

	it('getNotifieables - repos which are clean are fine', function(done) {
		commonP.createRepoAsync(_.extend(common.repoData, {
			isClean: true
		})).then(() => {}).delay(200).then(() => {
			job.getNotifieables(new Date(), 100, (err, data) => {
				expect(data.length).to.be(0);
				done();
			})
		});
	});

	it('getNotifieables - repos which are notified are fine', function(done) {
		commonP.createRepoAsync(_.extend(common.repoData, {
			notified: true
		})).then(() => {}).delay(200).then(() => {
			job.getNotifieables(new Date(), 100, (err, data) => {
				expect(data.length).to.be(0);
				done();
			})
		});
	});

	it('getNotifieables - repos which are notified + clean are fine', function(done) {
		commonP.createRepoAsync(_.extend(common.repoData, {
			notified: true,
			isClean: true
		})).then(() => {}).delay(200).then(() => {
			job.getNotifieables(new Date(), 100, (err, data) => {
				expect(data.length).to.be(0);
				done();
			})
		});
	});

	it('getNotifieables - repos are out of time should be here', function(done) {
		commonP.createRepoAsync(_.extend(common.repoData, {
			notified: false,
			isClean: false,
			status: {
				ahead: 1
			}
		})).then(() => {}).delay(200).then(() => {
			job.getNotifieables(new Date(), 100, (err, data) => {
				expect(data.length).to.be(1);
				done();
			})
		});
	});

	it('getNotifieables - repo not clean but pushed should be notified', function(done) {
		commonP.createRepoAsync(_.extend(common.repoData, {
			notified: false,
			isClean: false,
			status: {
				ahead: 0
			}
		})).then(() => {}).delay(200).then(() => {
			job.getNotifieables(new Date(), 100, (err, data) => {
				expect(data.length).to.be(1);
				done();
			})
		});
	});

	it('getNotifieables - repo clean but not pushed should be notified', function(done) {
		commonP.createRepoAsync(_.extend(common.repoData, {
			notified: false,
			isClean: true,
			status: {
				ahead: 1
			}
		})).then(() => {}).delay(200).then(() => {
			job.getNotifieables(new Date(), 100, (err, data) => {
				expect(data.length).to.be(1);
				done();
			})
		});
	});

	it('getInstallationOfRepo - list devices of repos (just one repo)', function(done) {

		asyncWaterfall([
      function(cb) {
				common.createRepo(common.repoData4, (err, data) => cb(err, data));
			},
			function(repo, cb) {
				common.installDevice(common.device, (err, data) => cb(err, repo, data));
			},
      function(repo, device, cb) {
				common.link(repo.res.body.id, device.res.body.id, (err, data) => cb(err, data));
			}
		]).then(() => {}).delay(200).then(() => {
			return asyncWaterfall([
	      (cb) => {
					job.getNotifieables(new Date(), 100, cb);
				},
				(repos, cb) => {
					job.getInstallationOfRepo(repos, cb);
				},
			]);
		}).then((res) => {
			expect(_.flatten(res).length).to.be(1);
			done();
		})

	});

	it('genNotification - gen a notification', function(done) {

		var notification = job.genNotification({
			name: 'test'
		});
		expect(notification.alert).to.be('Repo was not pushed - test');
		done();

	});

	it('sendNotification - should send a notification', function(done) {
		this.timeout(5000);

		async.waterfall([
			function(cb) {
				common.createRepo(common.repoData, (err, data) => cb(err, data));
			},
			function(repo, cb) {
				common.installDevice(common.device, (err, data) => cb(err, repo, data));
			},
			function(repo, device, cb) {
				common.link(repo.res.body.id, device.res.body.id, (err, data) => cb(err, repo, device));
			}
		], function(err, repo, device) {
			var notification = job.genNotification(repo.res.body);
			expect(notification).to.be.ok;
			job.sendNotification(device.res.body, notification, function(err, data){
				if(err) return done(err);
				done();
			});
		});

	});


});
