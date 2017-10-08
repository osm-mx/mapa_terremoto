var map, drawLayer, buildingsLayer, acopioLayer, alberguesLayer, ofrezcoLayer, necesitoLayer, mapillaryLayer, evaluacionLayer, escuelasLayer, osmCamLayer, nasaLayer;
var buildingExportLayer;
var radiusMarker = 3;

$(function(){
  initMap("map");

  addBuildingsData();
  addAcopioData();
  addAlberguesData();
  addOfrezcoNecesitoData();
  addMplData();
  addEvaluacionEstructural();
  addEscuelasLayer();
  addOsmCamData();
  addNasaData();
});


function addDAtaToLayer(layer, geojson, source){
  var feature;
  for(var i = 0; i < geojson.features.length; i++){
    geojson.features[i].properties["source"] = source;
  }

  layer.addData(geojson);
}


function addNasaData(){
  $.getJSON("/resources/data/nasa/positions.json", function(positions){
    var feature, image, anchors, latLngBounds;
    for(var i = 0; i < positions.kml.Document.Folder.Document.length; i++){
      feature = positions.kml.Document.Folder.Document[i];
      latLngBounds = feature.GroundOverlay.LatLonBox;

      // TopLeft, TopRight, BottomRight, BottomLeft
      anchors = [
        [latLngBounds.north, latLngBounds.west],
        [latLngBounds.north, latLngBounds.east],
        [latLngBounds.south, latLngBounds.east],
        [latLngBounds.south, latLngBounds.west]
      ];
      image = "/resources/data/nasa/" + feature.GroundOverlay.name;

      transformedImage = L.imageTransform(image, anchors, {});
      transformedImage.addTo(nasaLayer);
    }
  });
}

function addOsmCamData(){
  $.getJSON("/resources/data/osmcam/juchitan.json", {}, function(data){
    var geojson = {
      "type": "FeatureCollection",
      "features": []
    }

    var feature;
    for(var i = 0; i < data.currentPageItems.length; i++){
      feature = data.currentPageItems[i];

      geojson.features.push({
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [feature.lng, feature.lat]
        },
        "properties": {
          "image": "https://www.openstreetcam.org/" + feature.name,
          "source": "openstreetcam"
        }
      });
    }

    osmCamLayer.addData(geojson);
  }, "");
}


function addEscuelasLayer(){
  $.getJSON("/resources/data/escuelas/reapertura.geojson", function(geojson){
    escuelasLayer.addData(geojson);
  });
}


function addEvaluacionEstructural(){
  $.getJSON("https://cedn.carto.com/api/v2/sql?q=SELECT * FROM evaluacion_estructural_update&format=GeoJSON", function(data){
    evaluacionLayer.addData(data);
  });
}


function addMplData(geojson){
  $.getJSON("/resources/data/mapillary/data.geojson", function(geojson){
    mapillaryLayer.addData(geojson);
  });
}



function addBuildingsData(){
  $.getJSON("/resources/data/gob.mx/edificios_crowd.geojson", function(geojson){
    var feature, marker;
    for(var i = 0; i < geojson.features.length; i++){
      feature = geojson.features[i];
      feature.properties["source"] = "Mapeo Colaborativo || bit.ly/rescateMX";

      marker = buildMarker(feature.geometry.coordinates, feature.properties);
      buildingsLayer.RegisterMarker(marker);
    }

    buildingExportLayer.addData(geojson);
    buildingsLayer.ProcessView();
    $("#chargingDialog").modal('hide');
  });

  $.getJSON("/resources/data/gob.mx/edificios_oficial.geojson", function(geojson){
    var feature, marker;
    for(var i = 0; i < geojson.features.length; i++){
      feature = geojson.features[i];
      feature.properties["source"] = "Mapeo Colaborativo || bit.ly/rescateMX";

      marker = buildMarker(feature.geometry.coordinates, feature.properties);
      buildingsLayer.RegisterMarker(marker);
    }

    buildingExportLayer.addData(geojson);
    buildingsLayer.ProcessView();
  });


  $.getJSON("/resources/data/crisismap/buildings.geojson", function(geojson){
    var feature, marker;
    for(var i = 0; i < geojson.features.length; i++){
      feature = geojson.features[i];
      feature.properties["source"] = "crisismap";

      if(feature.geometry!==null){
        marker = buildMarker(feature.geometry.coordinates, feature.properties);
        buildingsLayer.RegisterMarker(marker);
      }
    }

    buildingExportLayer.addData(geojson);
    buildingsLayer.ProcessView();
  });

  $.getJSON("/resources/data/horizontal/buildings_c5.geojson", function(geojson){
    var feature, marker;
    for(var i = 0; i < geojson.features.length; i++){
      feature = geojson.features[i];
      feature.properties["source"] = "Verificado19s";

      if(feature.geometry!==null){
        marker = buildMarker(feature.geometry.coordinates, feature.properties);
        buildingsLayer.RegisterMarker(marker);
      }
    }

    buildingExportLayer.addData(geojson);
    buildingsLayer.ProcessView();
  });

  // verificado 19s
  $.getJSON("/resources/data/horizontal/edificios.geojson", function(geojson){
    var feature, marker;
    for(var i = 0; i < geojson.features.length; i++){
      feature = geojson.features[i];
      feature.properties["source"] = "Verificado19s";

      if(feature.geometry!==null){
        marker = buildMarker(feature.geometry.coordinates, feature.properties);
        buildingsLayer.RegisterMarker(marker);
      }
    }

    buildingExportLayer.addData(geojson);
    buildingsLayer.ProcessView();
  });
}




function addOfrezcoNecesitoData(){
  $.getJSON("/resources/data/ofrezco_necesito/ofrezco.geojson", function(ofrezco){
    ofrezcoLayer.addData(ofrezco);
  });


  $.getJSON("/resources/data/ofrezco_necesito/necesito.geojson", function(necesito){
    necesitoLayer.addData(necesito);
  });
}



function addAlberguesData(){
  $.getJSON("/resources/data/gob.mx/albergues_oficial.geojson", function(geojson){
    addDAtaToLayer(alberguesLayer, geojson, "Mapeo Colaborativo || bit.ly/rescateMX");
  });

  $.getJSON("/resources/data/gob.mx/albergues_crowd.geojson", function(geojson){
    addDAtaToLayer(alberguesLayer, geojson, "Mapeo Colaborativo || bit.ly/rescateMX");
  });

  $.getJSON("/resources/data/gmaps/albergues.geojson", function(geojson){
    addDAtaToLayer(alberguesLayer, geojson, "crisismap");
  });

  //crisismap
  $.getJSON("/resources/data/crisismap/albergues.geojson", function(geojson){
    addDAtaToLayer(alberguesLayer, geojson, "crisismap");
  });
}



function addAcopioData(){
  $.getJSON("/resources/data/gob.mx/acopio_oficial.geojson", function(geojson){
    addDAtaToLayer(acopioLayer, geojson, "Mapeo Colaborativo || bit.ly/rescateMX");
  });

  $.getJSON("/resources/data/gob.mx/acopio_crowd.geojson", function(geojson){
    addDAtaToLayer(acopioLayer, geojson, "Mapeo Colaborativo || bit.ly/rescateMX");
  });

  //crisismap
  $.getJSON("/resources/data/crisismap/acopio.geojson", function(geojson){
    addDAtaToLayer(acopioLayer, geojson, "crisismap");
  });


  // comunidad
  $.getJSON("/resources/data/comunidad/sandra_centros_acopio.geojson", function(geojson){
    addDAtaToLayer(acopioLayer, geojson, "Comunidad organizada");
  });

  // cni
  $.getJSON("/resources/data/cni/acopio.geojson", function(geojson){
    addDAtaToLayer(acopioLayer, geojson, "CNI");
  });
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


  buildingsLayer = buildBuildingLayer();


  escuelasLayer = L.geoJSON(null, {
    pointToLayer: function(geojsonPoint, latLng){
      var marker = L.VectorMarkers.icon({
        icon: 'pencil',
        markerColor: "green"
      });

      return L.marker(latLng, {icon: marker});
    }
  }).bindPopup(function (layer) {
    var properties = layer.feature.properties;

    var content = "<b>" + properties.name + "</b><br><br>";
    content += properties.description;

    return content;
  });


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
  });


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
    var skip = ["lon", "lat", "link_google_maps", "Field1", "url_google_maps", "Tipo", "tessellate", "extrude", "visibility"];
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
  });




  mapillaryLayer = L.geoJSON(null, {
    pointToLayer: function(geojsonPoint, latLng){
      return L.circleMarker(latLng, {radius: radiusMarker, color: "#2e4930", fillColor: "#2e4930"});
    }
  }).bindPopup(function (layer) {
    var properties = layer.feature.properties;
    var clientId = "dmMtOThHZkp6TzdwYW1qaFZLc1J3UTpiZTlkYjUwMjc3NmMzNGI1";
    var embedUrl = "https://embed-v1.mapillary.com/embed?show_segmentation=false&version=1&filter=%5B%22all%22%5D&map_filter=%5B%22all%22%5D&image_key=" + properties.key + "&client_id=" + clientId + "&style=photo";
    var linkUrl = "http://mapillary.com/map/im/" + properties.key;
    return "<div style='overflow: hidden;' ><iframe width=\"480\" height=\"320\" src=\"" + embedUrl + "\" frameborder=\"0\"></iframe><br><button style=\"float:right;background-color: #4CAF50;border: none;color: white;padding: 5px 11px;text-align: center;text-decoration: none;display: inline-block;font-size: 12px;\" onclick=\"window.open('" + linkUrl + "','_blank','resizable=yes')\">Open in Mapillary</button></div>"
  }, {maxWidth: "480px"});




  ofrezcoLayer = L.geoJSON(null, {
    pointToLayer: function(geojsonPoint, latLng){
      return L.circleMarker(latLng, {radius: radiusMarker, color: "#54b2a9", fillColor: "#54b2a9"});
    }
  }).bindPopup(function (layer) {
    var properties = layer.feature.properties;

    var skip = ["Timestamp", "Ofrezco/Necesito", "Al final de la encuesta vas a recibir un link, regresa cuando la ayuda haya sido suministrada","Geocoding", "Latlong"];
    var content = "";
    var rename = {
      "¿Qué ofrezco/necesito? (comida, hospedaje, agua, transporte, peritajes, etc.) - Por favor ofrece ayuda profesional (asistencia médica, peritajes) si eres un profesional en el tema":"¿Qué ofrezco?",
      "Nombre (Si eres miembro de una organización, también pon su nombre)": "Nombre",
      "Facebook (Pon tu handle o un link, recuerda que muchos nombres están repetidos en Facebook)": "Facebook"
    }

    var title;
    for(var key in properties){
      if(skip.indexOf(key) < 0 && properties[key]!=null){

        title = rename[key] ? rename[key]:key;
        content += "<b>" + title + "</b>: " + properties[key] + "<br>";
      }
    }

    return content;
  });




  necesitoLayer = L.geoJSON(null, {
    pointToLayer: function(geojsonPoint, latLng){
      return L.circleMarker(latLng, {radius: radiusMarker, color: "#ff2400", fillColor: "#ff2400"});
    }
  }).bindPopup(function (layer) {
    var properties = layer.feature.properties;


    var skip = ["Timestamp", "Al final de la encuesta vas a recibir un link, regresa cuando la ayuda haya sido suministrada"];
    var content = "";

    var rename = {
      "¿Qué ofrezco/necesito? (comida, hospedaje, agua, transporte, peritajes, etc.) - Por favor ofrece ayuda profesional (asistencia médica, peritajes) si eres un profesional en el tema":"¿Qué necesito?",
      "Nombre (Si eres miembro de una organización, también pon su nombre)": "Nombre",
      "Facebook (Pon tu handle o un link, recuerda que muchos nombres están repetidos en Facebook)": "Facebook"
    }

    var title;
    for(var key in properties){
      if(skip.indexOf(key) < 0 && properties[key]!=null){

        title = rename[key] ? rename[key]:key;
        content += "<b>" + title + "</b>: " + properties[key] + "<br>";
      }
    }

    return content;
  });


  evaluacionLayer = L.geoJSON(null, {
    pointToLayer: function(geojsonPoint, latLng){
      return L.circleMarker(latLng, {radius: radiusMarker, color: "#615a67", fillColor: "#615a67"});
    }
  }).bindPopup(function (layer) {
    var properties = layer.feature.properties;

    var html = "";
    if(properties.image){
      html += "<img src='" + properties.image + "' class='img-responsive'/>";
    }

    html += "Comentario: " + properties.field_4;

    return html;
  });


  osmCamLayer = L.geoJSON(null, {
    pointToLayer: function(geojsonPoint, latLng){
      return L.circleMarker(latLng, {radius: radiusMarker, color: "#14829a", fillColor: "#14829a"});
    }
  }).bindPopup(function (layer) {
    var properties = layer.feature.properties;

    var html = "<img src='" + properties.image + "' class='img-responsive'/>";

    return html;
  }, {maxWidth: "480", minWidth:"400"});


  nasaLayer = L.layerGroup().addTo(map);


  buildingExportLayer = L.geoJSON();

  layerControl.addOverlay(buildingsLayer, "Edificios afectados");
  layerControl.addOverlay(evaluacionLayer, "Evaluacion de edificios afectados");
  layerControl.addOverlay(nasaLayer, "NASA (análisis - áreas probablemente dañadas)");

  layerControl.addOverlay(alberguesLayer, "Albergues");
  layerControl.addOverlay(acopioLayer, "Centros de acopio");

  layerControl.addOverlay(mapillaryLayer, "Mapillary");

  layerControl.addOverlay(ofrezcoLayer, "Ofrezco ayuda");
  layerControl.addOverlay(necesitoLayer, "Necesito ayuda");

  layerControl.addOverlay(escuelasLayer, "Escuelas que reanudan clases");
  layerControl.addOverlay(osmCamLayer, "OpenStreetCam (Oaxaca y Chiapas)");

  map.on("overlayadd", function(e){
    if(e.name == "OpenStreetCam (Oaxaca y Chiapas)"){
      map.flyToBounds(osmCamLayer.getBounds());
    }
  });
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


function buildMarker(coordinates, properties){
  /*popup*/
  var content = "";

  if(properties["tipo_daño"]){
    content = "<b>" + properties["tipo_daño"] + "</b><br><br>";
  }else if(properties["Name"]){
    content = "<b>" + properties["Name"] + "</b><br><br>";
  }

  var skip = ["lon", "lat", "link_google_maps", "tipo_daño", "Name", "tessellate", "extrude", "visibility", "Timestamp", "latitud", "longitud", "field_1"];
  for(var key in properties){
    if(skip.indexOf(key) < 0){
      if(properties[key] && properties[key]!=="" && properties[key]!=="Si tienes info entra a: http://bit.ly/Verificado19s"){
        content += "<b>" + key + "</b>: " + properties[key] + "<br>";
      }
    }
  }


  if(properties["link_google_maps"]){
    content += "<br><a target='_blank' href='" + properties["link_google_maps"] + "'>link_google_maps</a><br>";
  }


  var marker = new PruneCluster.Marker(coordinates[1], coordinates[0]);
  marker.data.icon = L.divIcon({className: "leaflet-div-icon-point point-blue" });
  marker.data.popup = content;
  marker.data.properties = properties;
  return marker;
}


/*global $ L MQ*/
