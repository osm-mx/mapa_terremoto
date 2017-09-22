var fs = require('fs');
var DOMParser = require('xmldom').DOMParser;
var KMZGeoJSON = require('kmz-geojson');

var data_folder = "client/resources/data/";



function updateData(url, filename){
    KMZGeoJSON.toGeoJSON(url, function(err, json) {
        if(err){
            return console.log("error obteniendo los datos", filename, err);
        }
        
        fs.writeFile( data_folder + filename, JSON.stringify(json), "utf8", function(err, data){
            if(err){
                return console.log("error escribiendo en ", data_folder + filename);
            }
            
            console.log("archivo " + filename + "escrito correctamente");
        });
    });
}



function updateDataFromKmlFolder(url, filename, folderIndex){
    KMZGeoJSON.toKML(url, function(err, kml) {
        if(err){
            return console.log("Error obteniendo los datos", filename, "Intenando nuevamente");
        }
        
        var geojson = {
            "type":"FeatureCollection",
            "features":[]
        };
        
        kml = new DOMParser().parseFromString(kml);
        
        var folder = kml.getElementsByTagName("Folder")[folderIndex];
        var placemarks = folder.getElementsByTagName("Placemark");
        var coordinates, name, description;
        for( var i = 0; i < placemarks.length; i++){
            coordinates = placemarks[i].getElementsByTagName("coordinates")[0];
            name = placemarks[i].getElementsByTagName("name")[0].childNodes[0];
            description = placemarks[i].getElementsByTagName("description")[0].childNodes[0];
            
            if(!coordinates || !name || !description){
                continue;
            }
            
            coordinates = coordinates.childNodes[0].nodeValue.trim().split(",");
            geojson.features.push({
                "type":"Feature",
                "geometry":{
                    "type":"Point",
                    "coordinates": [ +coordinates[0], +coordinates[1] ]
                },
                "properties":{
                    "Name": name.nodeValue.trim(),
                    "Description": description.nodeValue.trim()
                }
            });
        }
        
        
        fs.writeFile( data_folder + filename, JSON.stringify(geojson), "utf8", function(err, data){
            if(err){
                return console.log("error escribiendo en ", data_folder + filename);
            }
            
            console.log("archivo " + filename + " escrito correctamente");
        });
    });
}


module.exports = {
    updateCrowdData: function(){
        console.log("updating data");
        
        // crisis map
        updateData("https://www.google.com/maps/d/u/0/kml?hl=en&mid=1-MoeFPnwmlrd-bnyj_iahD90dXk&cm.ttl=600", "crisismap/albergues.geojson");
        updateData("https://www.google.com/maps/d/u/0/kml?&mid=1bh16QwJjZjIJU2zpE9TnsmRBG9g&cm.ttl=600", "crisismap/acopio.geojson");
        updateDataFromKmlFolder("https://www.google.com/maps/d/u/0/kml?mid=1_-V97lbdgLFHpx-CtqhLWlJAnYY&cm.ttl=600", "crisismap/buildings.geojson", 3);
    }
};
