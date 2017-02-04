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
  // getRecord: function (req, res, next) {
  //   console.log(`getJob ${req.params.id}`)
  //   var connectionString = process.env.HEROKU_POSTGRESQL_ORANGE_URL || ENV().PG.url;
  //   var db = pgp(connectionString);
  //   db.one('select * from jobs where id = $1', req.params.id)
  //     .then(function (data) {
  //       res.status(200)
  //         .json({
  //           job: data
  //         });
  //     })
  //     .catch(function (err) {
  //       return next(err);
  //     });
  // },
  query: function (req, res, next) {
    let maybeCompanyId = _.get(req, 'query.company_id', null);
    //console.log(`get jobs for company ${req.query.company_id}`);
    var connectionString = process.env.DATABASE_URL;
    var db = pgp(connectionString);
    let whereClause = '';
    if(maybeCompanyId !== null){
      whereClause = `where company_id = $1`;
    }
    db.manyOrNone(`select * from jobs ${whereClause}`, maybeCompanyId)
      .then(function (data) {
        res.status(200)
          .json({
            jobs: data
          });
      })
      .catch(function (err) {
        return next(err);
      });
  },
  createRecord: function (req, res, next) {
    var id = uuid.v4();
    console.log("Create Job:");
    console.log(req.body);
    var job = req.body.job;
    job.id = id;

    var connectionString = process.env.DATABASE_URL;
    var db = pgp(connectionString);

    db.none('insert into jobs(id, label, summary, prompt, success_criteria, company_name, company_logo_url, hiring_manager, hiring_manager_pic_url)' +
        'values(${id}, ${label}, ${summary}, ${prompt}, ${success_criteria}, ${company_name}, ${company_logo_url}, ${hiring_manager}, ${hiring_manager_pic_url})',
      job)
      .then(function () {
        res.status(200)
          .json({
            job: {id: id}
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
