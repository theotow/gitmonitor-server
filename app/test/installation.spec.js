"use strict";

var config = require('../server/config');

describe('Installation', function() {
	lt.beforeEach.withApp(app);
  beforeEach(function(){
    app.loopback.getModel('installation').remove({});
  });

	it('should allow to create a device', function(done) {
		this.timeout(5000);

		async.waterfall([
			function(cb) {
				common.installDevice(common.device, cb);
			}
		], function(err, install) {
      expect(install.res.statusCode).to.be(200);
      expect(install.res.body.appId).to.be(config.id);
      expect(install.res.body.deviceType).to.be(common.device.deviceType);
      expect(install.res.body.deviceToken).to.be(common.device.deviceToken);
      done();
		});
	});

  it('should be able to link repo and device', function(done) {
		this.timeout(5000);

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
      expect(link.res.statusCode).to.be(200);
      expect(link.res.body.id).not.to.be(undefined);
      done();
		});
	});

  it('should be able to list my repos', function(done) {
    this.timeout(5000);

    async.waterfall([
      function(cb) {
        common.createRepo(common.repoData, cb);
      },
      function(repo, cb) {
        common.createRepo(common.repoData, (err, data) => cb(err, data));
      },
      function(repo, cb) {
        common.installDevice(common.device, (err, data) => cb(err, repo, data));
      },
      function(repo, device, cb) {
        common.link(repo.res.body.id, device.res.body.id, (err, data) => cb(err, device));
      },
      function(device, cb) {
        common.list(device.res.body.id, (err, data) => cb(err, data));
      }
    ], function(err, list) {
      expect(list.res.statusCode).to.be(200);
      expect(list.res.body[0].name).to.be(common.repoData.name);
      done();
    });
  });

});
