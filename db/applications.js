"use strict";
/*jshint node:true*/
var ENV = require('../../config/environment.js');

var promise = require('bluebird');
var uuid = require('node-uuid');
var options = {
  // Initialization Options
  promiseLib: promise,
  ssl: true
};
var pgp = require('pg-promise')(options);

var SELECT_WITH_BASIC_USER = 'select a.*, u.first_name, u.last_name from applications a join users u on u.id = a.user_id';

module.exports = {
  // import ENV from 'dovetail-express/config/environment';

  // var ENV = require('dovetail-express/config/environment');
  // db: function(){
  //   var connectionString = process.env.HEROKU_POSTGRESQL_ORANGE_URL || ENV.PG.url,
  //   return pgp(connectionString);
  // },

  getRecord: function (req, res, next) {
    console.log(`get application ${req.params.id}`)
    var connectionString = process.env.DATABASE_URL;
    var db = pgp(connectionString);
    db.one(`${SELECT_WITH_BASIC_USER} where a.id = $1`, req.params.id)
      .then(function (appData) {
        res.status(200)
          .json({
            application: appData
          });
      })
      .catch(function (err) {
        return next(err);
      });
  },
  query: function (req, res, next) {
    console.log(`get applications ${req.query.job_id}`)
    var connectionString = process.env.DATABASE_URL;
    var db = pgp(connectionString);
    db.manyOrNone(`${SELECT_WITH_BASIC_USER} where a.job_id = $1`, req.query.job_id)
      .then(function (data) {
        res.status(200)
          .json({
            applications: data
          });
      })
      .catch(function (err) {
        return next(err);
      });
  },
  createRecord: function (req, res, next) {
    var id = uuid.v4();
    console.log("Create Application:");
    console.log(req.body);
    var application = req.body.application;
    application.id = id;
  
    var connectionString = process.env.DATABASE_URL;
    var db = pgp(connectionString);

    db.none('insert into applications(id, user_id, job_id, video_token, status)' +
        'values(${id}, ${userId}, ${jobId}, ${video_token}, ${status})',
      application)
      .then(function () {
        res.status(200)
          .json({
            application: {id: id}
          });
      })
      .catch(function (err) {
        return next(err);
      });
  },
  updateRecord: function (req, res, next) {
    console.log(`put application ${req.params.id}`)
    console.log(req.body);
    var application = req.body.application;
    application.id = req.params.id;

    var connectionString = process.env.DATABASE_URL;
    var db = pgp(connectionString);

    db.none('update applications set video_token = ${videoToken}, status = ${status} where id = ${id}',
      application)
      .then(function () {
        res.status(200)
          .json({
            application: application
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }
};
