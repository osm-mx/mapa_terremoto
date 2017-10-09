var request = require('request');
var tj = require('@mapbox/togeojson');
var DOMParser = require('xmldom').DOMParser;
var utils = require("./utils");

function update(){
  request({
    method: "GET",
    uri: "https://www.google.com/maps/d/kml?mid=1izw6o7LuOTZslQFL-aRNlaXdVHc&lid=UHlO-sPyl2s&forcekml=1",
  }, function(err, response, kmlResponse){
    if(err){
      return console.log("Error getting data", err);
    }

    var kml = new DOMParser().parseFromString(kmlResponse);
    var features = tj.kml(kml).features;

    var geojson = {
      "type": "FeatureCollection",
      "features": []
    };

    var properties;
    for (var feature of features) {
      properties = {
        "name": feature.properties.name,
        "description": (feature.properties.description) ? feature.properties.description:""
      };

      feature.properties = properties;
      geojson.features.push(feature);
    }

    utils.writeFile("trabajadorxs/data.geojson", geojson);
    console.log("trabajadorxs actualizado correctamente");
  });
}


module.exports = {
  update: update
};
