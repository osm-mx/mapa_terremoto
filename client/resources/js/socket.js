/*global io*/

var socket = io();

socket.on("getPoints", function (featureCollection) {
    window.paintPoints(featureCollection);
});


window.insertPoint = function(geojson){
    socket.emit("insertPoint", geojson, function(id){
        $("#thanksModal").modal("show");
        window.cleanForms();
        //window.addPoint(geojson);
    });
};


window.insertPointNoGeo = function(geojson){
    socket.emit("insertPointNoGeo", geojson, function(id){
        $("#thanksModal").modal("show");
        window.cleanForms();
    });
};