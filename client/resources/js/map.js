var map, drawLayer, reportPoint, reportesCiudadanos, buildingsLayer, acopioLayer, alberguesLayer, ofrezcoLayer, necesitoLayer, mapillaryLayer;

var radiusMarker = 3;

var exportLayer;

$(function(){
    initMap("map");
    
    addBuildingsData();
    addAcopioData();
    addAlberguesData();
    addOfrezcoNecesitoData();
    addTweetData();
});



function addTweetData(){
    $.get("/resources/data/mapillary/sismocdmx_images.geojson", function(geojson){
        geojson = JSON.parse(geojson);
        mapillaryLayer.addData(geojson);
    });
}


function addOfrezcoNecesitoData(){
    $.get("/resources/data/ofrezco_necesito/ofresco_necesito.geojson", function(geojson){
        geojson = JSON.parse(geojson);
        
        var ofrezco = [];
        var necesito = [];
        
        var feature, properties;
        for(var i = 0; i < geojson.features.length; i++){
            feature = geojson.features[i];
            properties = feature.properties;
            
            if(properties["Ofrezco/Necesito"]==="Ofrezco"){
                ofrezco.push(feature);
            }else{
                necesito.push(feature);
            }
        }
        
        ofrezcoLayer.addData(ofrezco);
        necesitoLayer.addData(necesito);
    });
    
}



function addBuildingsData(){
    $.get("/resources/data/building_oficial.geojson", function(geojson){
        geojson = JSON.parse(geojson);
        
        exportLayer.addData(geojson);
        
        var feature, marker;
        for(var i = 0; i < geojson.features.length; i++){
            feature = geojson.features[i];
            
            marker = buildMarker(feature.geometry.coordinates, feature.properties);
            buildingsLayer.RegisterMarker(marker);
        }
        
        
        $.get("/resources/data/building_crowd.geojson", function(geojson){
            geojson = JSON.parse(geojson);
            
            var feature, marker;
            for(var i = 0; i < geojson.features.length; i++){
                feature = geojson.features[i];
                
                marker = buildMarker(feature.geometry.coordinates, feature.properties);
                buildingsLayer.RegisterMarker(marker);
            }
            exportLayer.addData(geojson);
            buildingsLayer.ProcessView();
        });
    });
    
    $.get("/resources/data/crisismap/buildings.geojson", function(geojson){
        geojson = JSON.parse(geojson);
        
        var feature, marker;
        for(var i = 0; i < geojson.features.length; i++){
            feature = geojson.features[i];
            
            if(feature.geometry!==null){
                marker = buildMarker(feature.geometry.coordinates, feature.properties);
                buildingsLayer.RegisterMarker(marker);
            }
        }
        exportLayer.addData(geojson);
        buildingsLayer.ProcessView();
    });
}



function addAlberguesData(){
    $.get("/resources/data/albergues_oficial.geojson", function(geojson){
        alberguesLayer.addData(JSON.parse(geojson));
    });
    
    
    $.get("/resources/data/gmaps/albergues.geojson", function(geojson){
        alberguesLayer.addData(JSON.parse(geojson));
    });
    
    
    //crisismap
    $.get("/resources/data/crisismap/albergues.geojson", function(geojson){
        alberguesLayer.addData(JSON.parse(geojson));
    });
    
    /*
    SAME DATA AS /resources/data/albergues_oficial
    $.get("/resources/data/crisismap/albergues_2.geojson", function(geojson){
        alberguesLayer.addData(JSON.parse(geojson));
    });
    */
}



function addAcopioData(){
    $.get("/resources/data/acopio_oficial.geojson", function(geojson){
        acopioLayer.addData(JSON.parse(geojson));
    });
    
    
    $.get("/resources/data/acopio_crowd.geojson", function(geojson){
        acopioLayer.addData(JSON.parse(geojson));
    });
    
    //crisismap
    $.get("/resources/data/crisismap/acopio.geojson", function(geojson){
        acopioLayer.addData(JSON.parse(geojson));
    });
    
    /*
    SAME DATA AS /resources/data/acopio_oficial.geojson
    $.get("/resources/data/crisismap/acopio_2.geojson", function(geojson){
        acopioLayer.addData(JSON.parse(geojson));
    });
    */
}



function buildMarker(coordinates, properties){
    /*popup*/
    var content = "";
    
    if(properties["tipo_daño"]){
        content = "<b>" + properties["tipo_daño"] + "</b><br><br>";
    }else if(properties["Name"]){
        content = "<b>" + properties["Name"] + "</b><br><br>";
    }
    var skip = ["lon", "lat", "link_google_maps", "tipo_daño", "Name", "tessellate", "extrude", "visibility"];
    for(var key in properties){
        if(skip.indexOf(key) < 0){
            content += "<b>" + key + "</b>: " + properties[key] + "<br>";
        }
    }
    content += "<br><a target='_blank' href='" + properties["link_google_maps"] + "'>link_google_maps</a><br>";
    
    
    var marker = new PruneCluster.Marker(coordinates[1], coordinates[0]);
    marker.data.icon = L.divIcon({className: "leaflet-div-icon-point point-blue" });
    marker.data.popup = content;
    
    return marker;
}



function newPoint(){
    $("#newPoint").html("Ahora solo da clic donde quieras realizar el reporte");
    $("#newPoint").addClass("disabled");
    
    map.on("mousemove", function(evt){
        drawLayer.openTooltip(evt.latlng);
        $("#map").css("cursor", "pointer");
    });
    
    
    map.on("mouseout", function(evt){
        drawLayer.closeTooltip();
        $("#map").css("cursor", "default");
    });
    
    
    map.on("click", function(evt){
        
        drawLayer.closeTooltip();
        
        $("#newPoint").html('<i class="fa fa-map-marker"></i>&nbsp;Nuevo reporte');
        $("#newPoint").removeClass("disabled");
        
        $("#map").css("cursor", "default");
        
        reportPoint = L.marker(evt.latlng);
        
        drawLayer.addLayer(reportPoint);
        $('#pointDataDialog').modal('show');
        
        map.off();
    });
}



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
            "codigo_postal": $("#codigoPostal").val()
        }
    };
    
    var calle1 = $("#betweenStreets1").val();
    var calle2 = $("#betweenStreets2").val();
    if(calle1 !== ""){
        geojson.properties["entre_calles"] = calle1;
        
        if( calle2 !== ""){
            geojson.properties["entre_calles"] += " y " + calle2;
        }
    }
    
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
    var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    });
    
    // mapbox
    var mapboxTiles = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/streets-v8/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW1sZW8iLCJhIjoiT0tfdlBSVSJ9.Qqzb4uGRSDRSGqZlV6koGg",{
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Tiles thanks to © <a href="http://mapbox.com">Mapbox</a>'
    });

    // mapbox satellite streets
    var mapboxSatelliteTiles = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiaW1sZW8iLCJhIjoiT0tfdlBSVSJ9.Qqzb4uGRSDRSGqZlV6koGg",{
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, Tiles thanks to © <a href="http://mapbox.com">Mapbox</a>'
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
    
    
    var layerControl = L.control.layers({"OSM":osm, "Mapbox": mapboxTiles, "Mapbox Satellite": mapboxSatelliteTiles, "Mapquest": mapQuestTiles}, {}, {collapsed: true}).addTo(map);

    drawLayer = L.featureGroup().addTo(map);
    drawLayer.bindTooltip("Ahora solo da clic donde quieras realizar el reporte");
    
    
    // locate
    L.control.locate({
        strings: {
            title: "Encuéntrame",
            popup: ""
        },
        icon: "fa fa-location-arrow"
    }).addTo(map);
    
    // Map bounds
    map.fitBounds(L.latLngBounds({lat: 19.54717273337944, lng: -98.87901306152345}, {lat: 19.25248771280758, lng: -99.34387207031251}));

    // resize control
    $(window).resize(function() {
        map.invalidateSize();
    });
    
    
    // reportes
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
    
    
    
    
    buildingsLayer = buildBuildingLayer();
    
    
    /*
    buildingsLayer = L.geoJSON(null, {
        pointToLayer: function(geojsonPoint, latLng){
            return L.circleMarker(latLng, {radius: radiusMarker});
        }
    }).bindPopup(function (layer) {
        var properties = layer.feature.properties;
        
        var content = "<b>" + properties["tipo_daño"] + "</b><br><br>";
        var skip = ["lon", "lat", "link_google_maps", "tipo_daño"];
        for(var key in properties){
            if(skip.indexOf(key) < 0){
                content += "<b>" + key + "</b>: " + properties[key] + "<br>";
            }
        }
        
        content += "<br><a target='_blank' href='" + properties["link_google_maps"] + "'>link_google_maps</a><br>";
        return content;
    }).addTo(map);
    */
    
    
    alberguesLayer = L.geoJSON(null, {
        pointToLayer: function(geojsonPoint, latLng){
            var marker = L.VectorMarkers.icon({
                icon: 'home',
                markerColor: "green"
            });

            return L.marker(latLng, {icon: marker});
        }
    }).bindPopup(function (layer) {
        var properties = layer.feature.properties;
        
        var content = "<b>Albergue</b><br><br>";
        var skip = ["lon", "lat", "link_google_maps", "Tipo", "tessellate", "extrude", "visibility"];
        for(var key in properties){
            if(skip.indexOf(key) < 0){
                content += "<b>" + key + "</b>: " + properties[key] + "<br>";
            }
        }
        
        
        
        content += "<br><a target='_blank' href='" + properties["link_google_maps"] + "'>link_google_maps</a><br>";
        return content;
    })//.addTo(map);
        
        
    acopioLayer = L.geoJSON(null, {
        pointToLayer: function(geojsonPoint, latLng){
            var marker = L.VectorMarkers.icon({
                icon: 'shopping-basket',
                markerColor: "green"
            });

            return L.marker(latLng, {icon: marker});
        }
    }).bindPopup(function (layer) {
        var properties = layer.feature.properties;
        
        var content;
        if(properties["Tipo"]){
            content = "<b>" + properties["Tipo"] + "</b><br><br>";
        }else{
            content = "<b>Centro de acopio</b><br><br>";
        }
        var skip = ["lon", "lat", "link_google_maps", "Field1", "url_google_maps", "Tipo"];
        for(var key in properties){
            if(skip.indexOf(key) < 0){
                content += "<b>" + key + "</b>: " + properties[key] + "<br>";
            }
        }
        
        
        if(properties["url_google_maps"]){
            content += "<br><a target='_blank' href='" + properties["url_google_maps"] + "'>link_google_maps</a><br>";
        }else if(properties["link_google_maps"]){
            content += "<br><a target='_blank' href='" + properties["link_google_maps"] + "'>link_google_maps</a><br>";
        }
        
        
        return content;
    })//.addTo(map);
    
    
    
    
    mapillaryLayer = L.geoJSON(null, {
        pointToLayer: function(geojsonPoint, latLng){
            var marker = L.VectorMarkers.icon({
                icon: 'tweet',
                markerColor: "cadetblue"
            });

            return L.circleMarker(latLng, {radius: 5, color: "#2e4930", fillColor: "#2e4930"});
        }
    }).bindPopup(function (layer) {
        var properties = layer.feature.properties;
        var clientId = "dmMtOThHZkp6TzdwYW1qaFZLc1J3UTpiZTlkYjUwMjc3NmMzNGI1";
        var url = "https://embed-v1.mapillary.com/embed?show_segmentation=false&version=1&filter=%5B%22all%22%5D&map_filter=%5B%22all%22%5D&image_key=" + properties.key + "&client_id=" + clientId + "&style=photo";
        return "<div style='overflow: hidden;' ><iframe width=\"480\" height=\"320\" src=\"" + url + "\" frameborder=\"0\"></iframe><br><button style=\"float:right;background-color: #4CAF50;border: none;color: white;padding: 5px 11px;text-align: center;text-decoration: none;display: inline-block;font-size: 12px;\" onclick=\"window.open('" + url + "','_blank','resizable=yes')\">Open in Mapillary</button></div>"
    }, {maxWidth: "400px"});
    
    
    
    
    ofrezcoLayer = L.geoJSON(null, {
        pointToLayer: function(geojsonPoint, latLng){
            return L.circleMarker(latLng, {radius: 5, color: "#54b2a9", fillColor: "#54b2a9"});
        }
    }).bindPopup(function (layer) {
        var properties = layer.feature.properties;
        
        
        var content = "<b>Ofrezco: </b>" + properties["¿Qué ofrezco/necesito? (comida, hospedaje, agua, transporte, peritajes, etc.)"] + "<br><br>";
        
        content += "Nombre: " + properties["Nombre"] + "<br>";
        content += "Contacto: " + properties["Contacto (Correo, Facebook, teléfono, WhatsApp, Twitter, etc.) (Nota: Esta información es pública, solo pon datos que creas pertinentes compartir)"] + "<br>";
        
        return content;
    });
    
    
    
    
    necesitoLayer = L.geoJSON(null, {
        pointToLayer: function(geojsonPoint, latLng){
            return L.circleMarker(latLng, {radius: 5, color: "#ff2400", fillColor: "#ff2400"});
        }
    }).bindPopup(function (layer) {
        var properties = layer.feature.properties;
        
        var content = "<b>Necesito: </b>" + properties["¿Qué ofrezco/necesito? (comida, hospedaje, agua, transporte, peritajes, etc.)"] + "<br><br>";
        
        content += "Nombre: " + properties["Nombre"] + "<br>";
        content += "Contacto: " + properties["Contacto (Correo, Facebook, teléfono, WhatsApp, Twitter, etc.) (Nota: Esta información es pública, solo pon datos que creas pertinentes compartir)"] + "<br>";
        
        
        return content;
    });
    
    
    exportLayer = L.geoJSON();
    layerControl.addOverlay(reportesCiudadanos, "Reportes ciudadanos");
    
    
    layerControl.addOverlay(buildingsLayer, "Edificios afectados");
    layerControl.addOverlay(alberguesLayer, "Albergues");
    layerControl.addOverlay(acopioLayer, "Centros de acopio");
    
    layerControl.addOverlay(mapillaryLayer, "Mapillary");
    
    layerControl.addOverlay(ofrezcoLayer, "Ofrezco ayuda");
    layerControl.addOverlay(necesitoLayer, "Necesito ayuda");
}







function buildBuildingLayer(){
    
    var pruneCluster = new PruneClusterForLeaflet();
    //setCustomMarker();
    
    /*
    pruneCluster.BuildLeafletClusterIcon = function(cluster) {
        var e = new L.Icon.MarkerCluster();

        e.stats = cluster.stats;
        e.population = cluster.population;

        return e;
    };
    */

    pruneCluster.BuildLeafletCluster = function(cluster, position) {
        var m = new L.Marker(position, {
            icon: pruneCluster.BuildLeafletClusterIcon(cluster)
        });

        m.on('click', function() {
            // Compute the  cluster bounds (it's slow : O(n))
            var markersArea = pruneCluster.Cluster.FindMarkersInArea(cluster.bounds);
            var b = pruneCluster.Cluster.ComputeBounds(markersArea);

            if (b) {
                var bounds = new L.LatLngBounds(new L.LatLng(b.minLat, b.maxLng),new L.LatLng(b.maxLat, b.minLng));

                var zoomLevelBefore = pruneCluster._map.getZoom();
                var zoomLevelAfter = pruneCluster._map.getBoundsZoom(bounds, false, new L.Point(20, 20, null));

                // If the zoom level doesn't change
                if (zoomLevelAfter === zoomLevelBefore) {
                    // Send an event for the LeafletSpiderfier
                    pruneCluster._map.fire('overlappingmarkers', {
                        cluster: pruneCluster,
                        markers: markersArea,
                        center: m.getLatLng(),
                        marker: m
                    });

                    pruneCluster._map.setView(position, zoomLevelAfter);
                }
                else {
                    pruneCluster._map.fitBounds(bounds);
                }
            }
        });

        m.on('mouseover', function() {
            if( window.map.getZoom() > 9 ){
                var markers = pruneCluster.Cluster.FindMarkersInArea(cluster.bounds);
                for( var i = 0; i < markers.length; i++ ){
                    window.drawLayer.addLayer(L.marker(markers[i].position, {icon: markers[i].data.icon, opacity: 0.5, zIndexOffset: -100}));
                }
            }
        });

        m.on('mouseout', function() {
            window.drawLayer.clearLayers();
        });

        return m;
    };
    
    map.addLayer(pruneCluster);
    return pruneCluster;
}




function setCustomMarker(){
    var colors = [];
    var pi2 = Math.PI * 2;

    L.Icon.MarkerCluster = L.Icon.extend({
        options: {
            iconSize: new L.Point(44, 44),
            className: 'prunecluster leaflet-markercluster-icon'
        },

        createIcon: function () {
            var e = document.createElement('canvas');
            this._setIconStyles(e, 'icon');
            var s = this.options.iconSize;
            e.width = s.x;
            e.height = s.y;
            this.draw(e.getContext('2d'), s.x, s.y);
            return e;
        },

        createShadow: function () {
            return null;
        },

        draw: function(canvas, width, height) {
            var start = 0;
            for (var i = 0, l = colors.length; i < l; ++i) {

                var size = this.stats[i] / this.population;


                if (size > 0) {
                    canvas.beginPath();
                    canvas.moveTo(22, 22);
                    canvas.fillStyle = colors[i];
                    var from = start + 0.14,
                        to = start + size * pi2;

                    if (to < from) {
                        from = start;
                    }
                    canvas.arc(22,22,22, from, to);

                    start = start + size*pi2;
                    canvas.lineTo(22,22);
                    canvas.fill();
                    canvas.closePath();
                }

            }

            canvas.beginPath();
            canvas.fillStyle = 'white';
            canvas.arc(22, 22, 18, 0, Math.PI*2);
            canvas.fill();
            canvas.closePath();

            canvas.fillStyle = '#555';
            canvas.textAlign = 'center';
            canvas.textBaseline = 'middle';
            canvas.font = 'bold 12px sans-serif';

            canvas.fillText(this.population, 22, 22, 40);
        }
    });
}



/*global $ L MQ*/