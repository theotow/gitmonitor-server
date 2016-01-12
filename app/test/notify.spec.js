"use strict";

var job = require('../server/job');
var models = require('../server/server').models;

describe('Notify', () => {
	lt.beforeEach.withApp(app);

	before((cb) => {
		common.createRepo(common.repoData, () => {});
		setTimeout(() => {
			cb();
		}, 100);
	});
	it('getNotifieables - repos create now or less then 5sec. are not notified', function(done) {
		this.timeout(5000);
		job.getNotifieables(new Date(), 5000, (err, data) => {
			expect(data.length).to.be(0);
			done();
		})
	});

	before((cb) => {
		common.createRepo(_.extend(common.repoData, {
			isClean: true
		}), () => {});
		setTimeout(() => {
			cb();
		}, 100);
	});
	it('getNotifieables - repos which are clean are fine', function(done) {
		this.timeout(5000);
		job.getNotifieables(new Date(), 5000, (err, data) => {
			expect(data.length).to.be(0);
			done();
		})
	});

	before((cb) => {
		common.createRepo(_.extend(common.repoData, {
			notified: true
		}), () => {});
		setTimeout(() => {
			cb();
		}, 100);
	});
	it('getNotifieables - repos which are notified are fine', function(done) {
		this.timeout(5000);
		job.getNotifieables(new Date(), 5000, (err, data) => {
			expect(data.length).to.be(0);
			done();
		})
	});

	before((cb) => {
		common.createRepo(_.extend(common.repoData, {
			notified: true,
			isClean: true
		}), () => {});
		setTimeout(() => {
			cb();
		}, 100);
	});
	it('getNotifieables - repos which are notified + clean + in time are fine', function(done) {
		this.timeout(5000);
		job.getNotifieables(new Date(), 5000, (err, data) => {
			expect(data.length).to.be(0);
			done();
		})
	});

	before((cb) => {
		common.createRepo(common.repoData, () => {})
		setTimeout(() => {
			cb();
		}, 1000);
	});
	it('getNotifieables - repos are out of time should be here', function(done) {
		this.timeout(5000);
		job.getNotifieables(new Date(), 800, (err, data) => {
			expect(data.length).to.be.greaterThan(0);
			done();
		})
	});

	before((cb) => {
		async.waterfall([
      function(cb) {
				common.createRepo(common.repoData, (err, data) => cb(err, data));
			},
			function(repo, cb) {
				common.installDevice(common.device, (err, data) => cb(err, repo, data));
			},
      function(repo, device, cb) {
				common.link(repo.res.body.id, device.res.body.id, (err, data) => cb(err, data));
			}
		], function(err, link) {
			setTimeout(() => {
				cb();
			}, 100);
		});
	});
	it('getInstallationOfRepo - list devices of repos (just one repo)', function(done) {
		this.timeout(5000);

		async.waterfall([
      (cb) => {
				job.getNotifieables(new Date(), 800, cb);
			},
			(repos, cb) => {
				job.getInstallationOfRepo(repos, cb);
			},
		], (err, res) => {
			expect(_.flatten(res).length).to.be(1);
			done();
		});
	});

	it('genNotification - gen a notification', function(done) {
		this.timeout(5000);

		var notification = job.genNotification({
			name: 'test'
		});
		expect(notification.alert).to.be('Repo was not pushed - test');
		done();

	});

	before((cb) => {
		async.waterfall([
			function(cb) {
				common.createRepo(common.repoData, (err, data) => cb(err, data));
			},
			function(repo, cb) {
				common.installDevice(common.device, (err, data) => cb(err, repo, data));
			},
			function(repo, device, cb) {
				common.link(repo.res.body.id, device.res.body.id, (err, data) => cb(err, data));
			}
		], function(err, link) {
			setTimeout(() => {
				cb();
			}, 100);
		});
	});
	it('sendNotification - should send a notification', function(done) {
		this.timeout(5000);

		async.waterfall([
			(cb) => {
				job.getNotifieables(new Date(), 800, cb);
			},
			(repos, cb) => {
				job.getInstallationOfRepo(repos, (err, data) => cb(err, data, repos));
			},
		], (err, devices, repos) => {
			var device = _.flatten(devices)[0];
			var repo = repos[0];
			var notification = job.genNotification(repo);
			job.sendNotification(device, notification, function(err, data){
				done();
			});
		});

	});


});
