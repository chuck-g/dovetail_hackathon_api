"use strict";
/*jshint node:true*/

// var ENV = require('../../config/environment.js');
var promise = require('bluebird');
var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);

var _ = require('lodash');
var uuid = require('node-uuid');

module.exports = {
  // todo comment this out later or put it behind login
  // getAll: function (req, res, next) {
  //   console.log(`getJobs`)
  //   var connectionString = process.env.HEROKU_POSTGRESQL_ORANGE_URL || ENV().PG.url;
  //   var db = pgp(connectionString);
  //   db.manyOrNone('select * from jobs')
  //     .then(function (data) {
  //       res.status(200)
  //         .json({
  //           jobs: data
  //         });
  //     })
  //     .catch(function (err) {
  //       return next(err);
  //     });
  // },

  createRecord: function (req, res, next) {
    var id = uuid.v4();
    console.log("Create Feedback:");
    console.log(req.body);
    var feedback = req.body;
    feedback.id = id;

    var connectionString = process.env.DATABASE_URL;
    var db = pgp(connectionString);

    db.none('insert into feedback(id, job_id, contact_name, email, rating, follow_up_opt_in)' +
        'values(${id}, ${job_id}, ${contact_name}, ${email}, ${rating}, ${follow_up_opt_in})',
      feedback)
      .then(function () {
        res.status(200)
          .json({
            feedback: {id: id}
          });
      })
      .catch(function (err) {
        return next(err);
      });
  }//,
  // updateRecord: function(req, res, next){
  //   var id = uuid.v4();
  //   console.log("Update Job:");
  //   console.log(req.body);
  //   var job = req.body.job;
  //
  //   var connectionString = process.env.HEROKU_POSTGRESQL_ORANGE_URL || ENV().PG.url;
  //   var db = pgp(connectionString);
  //
  //   db.none('update jobs set label=${label}, summary=${summary}, prompt=${prompt}, background=${background}, foreground=${foreground}, status=${status} where id = ${id}',
  //     job)
  //     .then(function () {
  //       res.status(200)
  //         .json({
  //           job: job
  //         });
  //     })
  //     .catch(function (err) {
  //       return next(err);
  //     });
  // }
};
