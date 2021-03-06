'use strict';

process.env.NODE_ENV = 'test';
global.expect = require('expect.js');
global.request = require('supertest');
global.Promise = require('bluebird');
global.async = require('async');
global._ = require('lodash');
global.lt = require('loopback-testing');
global.app = require('../server/server.js');

global.common = {
  installDevice(obj, cb) {
      var http = request(app)
        .post('/api/installations')
        .set('Accept', 'application/json')
        .send(obj)
        .end((err) => cb(err, http));
    },
    installDevices(array, cb) {
        var funcArray = [];
        array.forEach(function(device){
          funcArray.push((cb) => global.common.installDevice(device, cb))
        });
        async.series(funcArray, cb);
      },
    createRepo(obj, cb) {
      var http = request(app)
        .post('/api/Repos/')
        .set('Accept', 'application/json')
        .send(obj)
        .end((err) => cb(err, http));
    },
    createRepos(array, cb){
      var funcArray = [];
      array.forEach(function(repo){
        funcArray.push(function(cb){
          global.common.createRepo(repo, cb)
        })
      });
      async.series(funcArray, cb);
    },
    deleteRepo(id, cb) {
      var http = request(app)
        .delete('/api/Repos/' + id)
        .set('Accept', 'application/json')
        .end((err) => cb(err, http));
    },
    updateRepo(id, obj, cb) {
      var http = request(app)
        .put('/api/Repos/' + id)
        .set('Accept', 'application/json')
        .send(obj)
        .end((err) => cb(err, http));
    },
    link(rId, iId, cb){
      var http = request(app)
        .put('/api/installations/'+ iId +'/repos/rel/' + rId)
        .set('Accept', 'application/json')
        .end((err) => cb(err, http));
    },
    linkX(rId, array, cb){
      var funcArray = [];
      array.forEach(function(device){
        funcArray.push((cb) => global.common.link(rId, device.res.body.id, cb))
      });
      async.series(funcArray, cb);
    },
    list(iId, cb){
      var http = request(app)
        .get('/api/installations/'+ iId +'/repos')
        .set('Accept', 'application/json')
        .end((err) => cb(err, http));
    },
    device: {
      "deviceToken": "8ec3bba7de23cda5e8a2726c081be79204faede67529e617b625c984d61cf5c1",
      "deviceType": "ios"
    },
    device2: {
      "deviceToken": "8ec3bba7de23cda5e8a2726c081be79204faede67529e617b625c984d61cf5c2",
      "deviceType": "ios"
    },
    repoData: {
      branch: 'refs/heads/master',
      name: 'testdir4',
      author: 'Scott Chacon <schacon@gmail.com>',
      message: 'test',
      isClean: false,
      notified: false,
      branches: ['refs/heads/master'],
      status: {
        ahead: 0,
        behind: 0
      }
    },
		repoData4: {
      branch: 'refs/heads/master',
      name: 'testdir4',
      author: 'Scott Chacon <schacon@gmail.com>',
      message: 'test',
      isClean: false,
      notified: false,
      branches: ['refs/heads/master'],
      status: {
        ahead: 1,
        behind: 0
      }
    },
    repoData3: {
      branch: 'refs/heads/master',
      name: 'testdir5',
      author: 'Scott Chacon <schacon@gmail.com>',
      message: 'test',
      isClean: true,
      notified: false,
      branches: ['refs/heads/master'],
      status: {
        ahead: 1,
        behind: 0
      }
    },
    repoDataNew: {
      branch: 'refs/heads/master2',
      name: 'testdir5',
      author: 'Scott2 Chacon <schacon@gmail.com>',
      message: 'test2',
      isClean: true,
      notified: true,
      branches: ['refs/heads/master2', 'refs/heads/master3'],
      status: {
        ahead: 10,
        behind: 1
      }
    }
}
