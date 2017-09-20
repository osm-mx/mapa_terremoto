var map, drawLayer, reportPoint, reportesCiudadanos, collapsedBuildings, layerControl, hospitalLayer, internetLayer, acopioLayer, alberguesOficiales;


$(function(){
    initMap("map");
});



function saveData(){
    console.log("saving data");
    
    $("#formDataDialog").modal("hide");
    window.drawLayer.clearLayers();
    
    var geojson = {
        "type": "Feature",
        "geometry": {
        "type": "Point",
            "coordinates": [0, 0]
        },
        "properties": {
            "tipo_dano": $("#newPointMotivoNoGeo").val(),
            "personas_afectadas": $("#peopleAffectedNoGeo").val(),
            "personas_heridas_fallecidas": $("#peopleInjuredNoGeo").val(),
            "tipo_apoyo": $("#supportTypeNoGeo").val(),
            "contacto": $("#contactInfoNoGeo").val(),
            "info_adicional": $("#otherInfoNoGeo").val(),
            
            
            "ciudad_localidad": $("#city").val(),
            "delegacion_municipio": $("#mun").val(),
            "calle": $("#street").val(),
            "numero_ext": $("#streetNumber").val(),
            "entre_calles": $("#betweenStreets").val(),
            "codigo_postal": $("#codigoPostal").val()
        }
    };
    
    window.insertPointNoGeo(geojson);
}



function savePoint(){
    console.log("saving point");
    
    $("#pointDataDialog").modal("hide");
    window.drawLayer.clearLayers();
    
    
    var latLng = window.reportPoint.getLatLng();
    var geojson = {
        "type": "Feature",
        "geometry": {
        "type": "Point",
            "coordinates": [latLng.lat, latLng.lng]
        },
        "properties": {
            "tipo_dano": $("#newPointMotivo").val(),
            "personas_afectadas": $("#peopleAffected").val(),
            "personas_heridas_fallecidas": $("#peopleInjured").val(),
            "tipo_apoyo": $("#supportType").val(),
            "contacto": $("#contactInfo").val(),
            "info_adicional": $("#otherInfo").val()
        }
    };
    
    window.insertPoint(geojson);
}




function addPoint(geojson){
    console.log("adding data", geojson);
    
    // TODO: fix -> el punto no se agrega al mapa
    // el punto después de agregarse se debe de visualizar en el mapa en este momento el punto ya se guardo en la bd
    reportesCiudadanos.addData(geojson);
}



function paintPoints(featureCollection){
    reportesCiudadanos.addData(featureCollection);
    
    //map.fitBounds(reportesCiudadanos.getBounds())
}



function endDraw(){
    $("#pointDataDialog").modal("hide");

    window.drawLayer.clearLayers();

    $("#newPointComment").val("");
    $('.newPointValue').val("");
    $("#newPointLevel").val("1");
}


function cleanForms(){
    $("#formDataDialog").modal("hide");
    $(".formValue").val("");
}



function initMap(id){
    /* Basemap Layers */
    var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    
    // mapbox
    var mapboxTiles = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW1sZW8iLCJhIjoiT0tfdlBSVSJ9.Qqzb4uGRSDRSGqZlV6koGg",{
        attribution: 'datos.mx | Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Tiles thanks to © <a href="http://mapbox.com">Mapbox</a>'
    });

    // mapbox satellite streets
    var mapboxSatelliteTiles = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW1sZW8iLCJhIjoiT0tfdlBSVSJ9.Qqzb4uGRSDRSGqZlV6koGg",{
        attribution: 'datos.mx | Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Tiles thanks to © <a href="http://mapbox.com">Mapbox</a>'
    });

    // mapquest
    var mapQuestTiles = MQ.mapLayer();

    map = L.map(id, {
        center: [20,0],
        zoom: 3,
        minZoom: 3,
        maxZoom: 18,
        layers: mapboxTiles,osm, mapQuestTiles, mapboxSatelliteTiles,
        editable: true
    });
    
    
    layerControl = L.control.layers({"OSM":osm, "Mapbox": mapboxTiles, "Mapbox Satellite": mapboxSatelliteTiles, "Mapquest": mapQuestTiles}, {}).addTo(map);

    drawLayer = L.featureGroup().addTo(map);
    
    
    // locate
    L.control.locate({
        strings: {
            title: "Encuéntrame",
            popup: ""
        },
        icon: "fa fa-location-arrow"
    }).addTo(map);
    
    // Map bounds
    map.fitBounds(L.latLngBounds({lat: 19.46011816213774, lng: -99.07676696777344}, {lat: 19.38240918011228, lng: -99.21006202697754}));
    
    //map.fitBounds(L.latLngBounds({lat: 19.54717273337944, lng: -98.87901306152345}, {lat: 19.25248771280758, lng: -99.34387207031251}));

    // resize control
    $(window).resize(function() {
        map.invalidateSize();
    });
    
    var drawControl = buildDrawControl();
    map.addControl(drawControl);
    
    
    
    reportesCiudadanos = L.geoJSON([], {
        pointToLayer: function(geojsonPoint, latLng){
            var marker = L.VectorMarkers.icon({
                    icon: 'exclamation',
                    markerColor: "red"
                });

            return L.marker(latLng, {icon: marker});
        }
    }).bindPopup(function (layer) {
        var properties = layer.feature.properties;
        
        var content = "<b>" + properties.tipo_dano + "</b><br><br>";
        
        for(var key in properties){
            if(key !== "tipo_dano"){
                content += key + ": " + properties[key] + "<br>";
            }
        }
        
        return content;
    }).addTo(map);
    
    layerControl.addOverlay(reportesCiudadanos, "Reportes ciudadanos");
}




function buildDrawControl(){
    L.drawLocal.draw.toolbar.buttons.marker = 'Crear Reporte';

    L.drawLocal.draw.toolbar.actions.title = 'Cancelar Reporte';
    L.drawLocal.draw.toolbar.actions.text = 'Cancelar';

    L.drawLocal.draw.toolbar.finish.title = 'Finalizar';
    L.drawLocal.draw.toolbar.finish.text = 'Finalizar';

    L.drawLocal.draw.handlers.marker.tooltip.start = "Ahora solo da clic donde quieras realizar el reporte";

    L.drawLocal.draw.handlers.polygon.tooltip.start = "Inicia el dibujo con un clic";
    L.drawLocal.draw.handlers.polygon.tooltip.cont = "Da clic para continuar el dibujo";
    L.drawLocal.draw.handlers.polygon.tooltip.end = "Da clic en el primer punto para terminar el dibujo";

    L.drawLocal.draw.handlers.polyline.error = "<b>Error:</b> no puedes continuar tu dibujo en este punto";
    L.drawLocal.draw.handlers.polyline.tooltip.start = "Inicia el dibujo con un clic";
    L.drawLocal.draw.handlers.polyline.tooltip.cont = "Da clic para continuar el dibujo";
    L.drawLocal.draw.handlers.polyline.tooltip.end = "Da clic en el ultimo punto para terminar el dibujo";


    var toolbarOptions = {
        position: 'topleft',
        draw: {
            circle: false,
            rectangle: false,
            polygon: false,
            polyline: false
        },
        edit: {
            featureGroup: drawLayer,
            remove: false,
            edit: false
        }
    };
    

    map.on(L.Draw.Event.CREATED, function (e) {
        if( e.layerType === "marker" ){
            reportPoint = L.marker(e.layer.getLatLng(), {clickable: true});
    
            drawLayer.addLayer(reportPoint);
            $('#pointDataDialog').modal('show');
        }
    });

    return new L.Control.Draw(toolbarOptions);
}

/*global $ L MQ*/