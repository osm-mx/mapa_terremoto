var fs = require('fs');
var request = require('request');

var data_folder = "client/resources/data/";


function updateMapillary(link, geojson){
	if(link==null){
		link = "https://a.mapillary.com/v3/images?start_time=2017-09-20&client_id=Z0l2SnYzeXRIRDBpeC1xUWNTYTdqQTpiMzFiNTBiMWFkNWJkOWVl&bbox=-100.4727,17.7853,-96.1606,20.1359";
		geojson = {
            "type": "FeatureCollection",
            "features": []
        };
	}
    
    request({
        method: "GET",
        uri: link,
    }, function(err, response, geojsonResponse){
        if(err){
            return console.log("Error getting mapillary data", err);
        }
        
        geojson.features = geojson.features.concat(JSON.parse(geojsonResponse).features);
        
        if(response.headers.link){
            var linksHeaders = response.headers.link.split(",");
            for(var i = 0; i < linksHeaders.length; i++){
                if(linksHeaders[i].includes("rel=\"next")){
                    var regex = /http.*>;/i.exec(linksHeaders[i]);
                    var next_link = regex[0].slice(0,regex[0].length-2);
                    
    				updateMapillary(next_link, geojson);
                    break;
                }else if(i==linksHeaders.length-1){
    				writeFile(geojson, "mapillary/data.geojson");
                }
            }
        }
    });
	
}



function writeFile(geojson, filename){
    fs.writeFile(data_folder + filename, JSON.stringify(geojson), 'utf8', function(err){
        if(err){
            console.log(" ---- Error writing: " + filename, err);
        }
        console.log("Writed file: " + filename);
    });
}


module.exports = {
    updateCrowdData: function(){
        updateMapillary();
    },
    initData: function(){
        updateMapillary();
    }
};
