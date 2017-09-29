window.downloadEscuelas = function(){
	geojsonToCsv(escuelasLayer.toGeoJSON(), "escuelas_reanudan_clases");
}

window.downloadEdificios = function(){
	geojsonToCsv(buildingExportLayer.toGeoJSON(), "edificios_afectados");
}

window.downloadEvaluacion = function(){
	geojsonToCsv(evaluacionLayer.toGeoJSON(), "evaluacion_edificios_afectados");
}


window.downloadAlbergues = function(){
	geojsonToCsv(alberguesLayer.toGeoJSON(), "albergues");
}


window.downloadAcopio = function(){
	geojsonToCsv(acopioLayer.toGeoJSON(), "centros_acopio");
}


window.downloadMapillary = function(){
	geojsonToCsv(mapillaryLayer.toGeoJSON(), "mapillary_imagenes");
}


window.downloadOfrezco = function(){
	geojsonToCsv(ofrezcoLayer.toGeoJSON(), "ofrezco");
}


window.downloadNecesito = function(){
	geojsonToCsv(necesitoLayer.toGeoJSON(), "necesito");
}


function geojsonToCsv(geojson, filename){
    var filenamePrefix = "osm_";
    var csvContent = "\"longitud\",\"latitud\"";
    var separator = ",";
    var newLine = "\n";


    // build headers
    var skip = ["extrude", "tessellate", "visibility"];
    var headers = ["longitud", "latitud"];

    var feature, properties;
    for(var i = 0; i < geojson.features.length; i++){
        feature = geojson.features[i];
        properties = feature.properties;

        for(var key in properties){
            if(skip.indexOf(key) < 0 && headers.indexOf(key) < 0){
                headers.push(key);
                csvContent += separator + "\"" + key + "\"";
            }
        }
    }
    csvContent += newLine;

    var coordinates;
    for(i = 0; i < geojson.features.length; i++){
        feature = geojson.features[i];
        properties = feature.properties;
        coordinates = feature.geometry.coordinates;

        csvContent += coordinates[0] + separator + coordinates[1];

        for(var j = 2; j < headers.length; j++){
            if(properties[headers[j]]){
                csvContent += separator + "\"" + properties[headers[j]] + "\"";
            }else{
                csvContent += "";
            }
        }

        csvContent += newLine;
    }


    var blob = new Blob([csvContent], {type: "text/plain;charset=utf-8"});
    saveAs(blob, filenamePrefix + filename + ".csv");
}
