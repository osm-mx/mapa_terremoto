//dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var cartodb = require("./carto");
var path = require('path');
var io = require('socket.io')(http);

//setup
app.set('port', process.env.PORT || 22345);
app.use(express.static(path.join(__dirname, 'client')));


//sockets
io.on('connection', function(socket){
    
    cartodb.getPoints(function(featureCollection){
        socket.emit("getPoints", featureCollection);
    });
    
    socket.on("insertPoint", function(geojson, callback){
        cartodb.insertPoint(geojson, function(geojsonResponse){
            callback(geojson);
        });
    });
    
    socket.on("insertPointNoGeo", function(geojson, callback){
        cartodb.insertPointNoGeo(geojson, function(geojsonResponse){
            callback(geojson);
        });
    });

});

//start
http.listen(app.get('port'), function(){
  console.log('server on port ' + app.get('port'));
});
