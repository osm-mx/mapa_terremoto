//dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var schedule = require('node-schedule');

// updaters
var mapillaryUpdater = require('./updaters/mapillary');
var gobUpdater = require('./updaters/gob_mx');


//setup
app.set('port', process.env.PORT || 22345);
app.use(express.static(path.join(__dirname, 'client')));


//gupdates
schedule.scheduleJob('05 * * * *', function(){
    mapillaryUpdater.update();
    gobUpdater.updateAll();
});


//start
http.listen(app.get('port'), function(){
    console.log('server on port ' + app.get('port'));
});
