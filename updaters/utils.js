var fs = require("fs");
var request = require("request");
var gsjson = require('google-spreadsheet-to-json');

var data_folder = "client/resources/data/";


function getGeojsonSheet(userOptions, callback){
	var options = {
		lat: "lat",
		lon: "lon",
		skipColumns: [],
		renameColumns: {}
	}

	if(userOptions){
		for(var key in userOptions){
			options[key] = userOptions[key];
		}
	}

	options.skipColumns.push(options.lat);
	options.skipColumns.push(options.lon);

    gsjson({
        spreadsheetId: options.documentId,
        worksheet: [options.spreadsheet]
    }).then(function(result) {
        var features = [];

		var feature, geojson, columnTitle;
        for(var i = 0; i < result[0].length; i++){
            feature = result[0][i];

            if(isValid(feature, options)){
				geojson = {
					"type": "Feature",
					"geometry": {
						"type": "Point",
						"coordinates": [ +feature[options.lon], +feature[options.lat]]
					},
					"properties": {}
				}

				for(var key in feature){
					if(options.skipColumns.indexOf(key) < 0){
						columnTitle = options.renameColumns[key] ? options.renameColumns[key]:key;
						geojson.properties[columnTitle] = feature[key];
					}
				}

                features.push(geojson);
            }
        }

		geojson = {
			"type": "FeatureCollection",
			"features": features
		}
        callback(null, geojson);
    }).catch(function(err) {
		callback(err, null);
    });
}


function isValid(feature, options){
	return (feature[options.lat] || feature[options.lon] || !isNaN(feature[options.lat]) || !isNaN(feature[options.lon]));
}


function writeFile(filename, geojson){
    fs.writeFile(data_folder + filename, JSON.stringify(geojson), 'utf8', function(err){
        if(err){
            return console.log(" ---- Error writing: " + filename, err);
        }
        console.log("Writed file: " + filename);
    });
}

module.exports = {
    getGeojsonSheet: getGeojsonSheet,
	writeFile: writeFile
};
