#!/usr/bin/env node
var models = require('./server.js').models;
var async = require('async');

model.Repo.find({}, function(err, data){
  console.log(err, data);
});
