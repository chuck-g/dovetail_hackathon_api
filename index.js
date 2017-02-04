var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var jobDb = require('./db/jobs');
//var applicationsDb =  require('./db/applications');

var pg = require('pg');
app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});


app.get('/job', function(request, response) {
  response.render('pages/job');
});
// app.post('/job/create', function(request, response) {
//   console.log(request.body);
//   response.render('pages/index');
// });

app.get('/api/job/:id', jobDb.getRecord);
app.get('/api/jobs', jobDb.query);
app.post('/api/jobs', jobDb.createRecord);

//app.post('/api/applications', applicationsDb.createRecord);
//app.get('/api/applications', applicationsDb.query);

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

/*var cool = require('cool-ascii-faces');
var express = require('express');
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index')
});

app.get('/cool', function(request, response) {
  response.send(cool());
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
*/
