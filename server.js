//dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var schedule = require('node-schedule');

// updaters
var mapillaryUpdater = require('./updaters/mapillary');
var gobUpdater = require('./updaters/gob_mx');
var trabajadorxsUpdater = require('./updaters/trabajadorxs_riesgo');


//setup
app.set('port', process.env.PORT || 22345);
app.use(express.static(path.join(__dirname, 'client')));


//updates
schedule.scheduleJob('05 * * * *', function(){
  gobUpdater.updateAll();
});
schedule.scheduleJob('40 * * * *', function(){
  mapillaryUpdater.update();
  trabajadorxsUpdater.update();
});


//start
http.listen(app.get('port'), function(){
  console.log('server on port ' + app.get('port'));
});
