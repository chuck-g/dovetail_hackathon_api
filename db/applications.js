"use strict";
/*jshint node:true*/
// var ENV = require('../../config/environment.js');

var promise = require('bluebird');
var uuid = require('node-uuid');
var options = {
  // Initialization Options
  promiseLib: promise
};
var pgp = require('pg-promise')(options);

var emailHelper = require('sendgrid').mail;
var sg = require('sendgrid')(process.env.SENDGRID_API_KEY);

var SELECT_WITH_BASIC_USER = 'select a.*, u.first_name, u.last_name from applications a join users u on u.id = a.user_id';

module.exports = {
  // import ENV from 'dovetail-express/config/environment';

  // var ENV = require('dovetail-express/config/environment');
  // db: function(){
  //   var connectionString = process.env.HEROKU_POSTGRESQL_ORANGE_URL || ENV.PG.url,
  //   return pgp(connectionString);
  // },

  // getRecord: function (req, res, next) {
  //   console.log(`get application ${req.params.id}`)
  //   var connectionString = process.env.DATABASE_URLr;
  //   var db = pgp(connectionString);
  //   db.one(`${SELECT_WITH_BASIC_USER} where a.id = $1`, req.params.id)
  //     .then(function (appData) {
  //       res.status(200)
  //         .json({
  //           application: appData
  //         });
  //     })
  //     .catch(function (err) {
  //       return next(err);
  //     });
  // },
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

    db.none('insert into applications(id, user_id, job_id, video_token)' +
        'values(${id}, ${user_id}, ${job_id}, ${video_token})',
      application)
      .then(function () {

        res.status(200)
          .json({
            application: {id: id}
          });

        db.one(`select * from jobs where id=${job_id}`, application)
          .then(function (data) {

          // send email to HM
          var from_email = new emailHelper.Email('noreply@dovetailtalent.com');
          var to_email = new emailHelper.Email(data.hiring_manager_email);
          var subject = 'New Application for '+data.label;
          var body = `Name: ${application.contact_name}\nEmail: ${application.email}\nVideo URL: ${application.video_token}`;
          var content = new emailHelper.Content('text/plain', body);
          var mail = new emailHelper.Mail(from_email, subject, to_email, content);

          var request = sg.emptyRequest({
            method: 'POST',
            path: '/v3/mail/send',
            body: mail.toJSON(),
          });

          sg.API(request, function(error, response) {
            console.log(response.statusCode);
            console.log(response.body);
            console.log(response.headers);
          });

      })
      .catch(function (err) {
        return next(err);
      });
    })
  }
};
