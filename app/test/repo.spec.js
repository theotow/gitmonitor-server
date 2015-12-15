"use strict";

var config = require('../server/config');

describe('Repo', function() {
	lt.beforeEach.withApp(app);
  beforeEach(function(){
    app.loopback.getModel('installation').remove({});
  });

	it('should be able to create Repo', function(done) {
		this.timeout(5000);

		async.waterfall([
			function(cb) {
				common.createRepo(common.repoData, cb);
			}
		], function(err, repo) {
      expect(repo.res.statusCode).to.be(200);
      expect(repo.res.body.id).not.to.be(undefined);
      done();
		});
	});

	it('should be able to delete Repo', function(done) {
		this.timeout(5000);

		async.waterfall([
			function(cb) {
				common.createRepo(common.repoData, (err, data) => cb(err, data));
			},
			function(data, cb) {
				common.deleteRepo(data.res.body.id, cb);
			}
		], function(err, repo) {
			expect(repo.res.statusCode).to.be(200);
			done();
		});
	});

	it.only('repo should disappear from user repos when deleted', function(done) {
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
      },
			function(data, device, cb) {
				common.deleteRepo(data.res.body.id, (err, data) => cb(err, device));
			},
			function(device, cb) {
        common.list(device.res.body.id, (err, data) => cb(err, data));
      }
		], function(err, list) {
			expect(list.res.statusCode).to.be(200);
			expect(list.res.body.length).to.be(0);
			done();
		});
	});

	it('should be able to update Repo', function(done) {
		this.timeout(5000);

		async.waterfall([
			function(cb) {
				common.createRepo(common.repoData, (err, data) => cb(err, data));
			},
			function(data, cb) {
				common.updateRepo(data.res.body.id, common.repoDataNew, cb);
			}
		], function(err, repo) {
			expect(repo.res.statusCode).to.be(200);
			expect(repo.res.body.name).to.be(common.repoDataNew.name);
			expect(repo.res.body.notified).to.be(common.repoDataNew.notified);
			expect(repo.res.body.branch).to.be(common.repoDataNew.branch);
			expect(repo.res.body.branches.length).to.be(common.repoDataNew.branches.length);
			expect(repo.res.body.clean).to.be(common.repoDataNew.clean);
			expect(repo.res.body.message).to.be(common.repoDataNew.message);
			expect(repo.res.body.status).to.eql(common.repoDataNew.status);
			done();
		});
	});
});
