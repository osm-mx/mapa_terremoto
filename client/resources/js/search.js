var foundMarkers=[];
var dbSearch=null;
function buildHashes() {
	if(!dbSearch){
		dbSearch = {};
	  function makeDbRecord(e,i){
			return {
				_id:i, 
				properties: e.feature.properties,
				txt: JSON.stringify(e.feature.properties).toLowerCase(),
				coordinates: e.getLatLng()}
		}
		dbSearch.buildingsLayer = buildingsLayer.GetMarkers().map(function(e,i){
			return {
				_id:i, 
				properties: e.data.properties,
				txt: e.data.popup.toLowerCase(),
				coordinates: e.position
			}
		});
		dbSearch.acopioLayer = acopioLayer.getLayers().map(makeDbRecord);
		dbSearch.alberguesLayer = alberguesLayer.getLayers().map(makeDbRecord);
		dbSearch.ofrezcoLayer = ofrezcoLayer.getLayers().map(makeDbRecord);
		dbSearch.necesitoLayer = necesitoLayer.getLayers().map(makeDbRecord);
		dbSearch.mapillaryLayer = mapillaryLayer.getLayers().map(makeDbRecord);
	}
}

$(function(){

	$('#search').bootcomplete({
		filter:function(term){
			$(".form-map").addClass("active");
			//Debounce event
			return new Promise(function(resolve){
				buildHashes();
				setTimeout(function(){

					term = term.toLowerCase();
					var filterByTerm  = function(element) {
						return element.txt.indexOf(term) >0;
					}
					var markerToAutocomplete = function(marker,index){
						var content = ["Edificio Dañado",marker.properties["tipo_daño"], marker.properties.dirección_completa, marker.properties.descripcion]
						return {id: marker._id, type:"Edificio", label: content};
					}
					var layertoAutocomplete = function(name){
						return function(layer,index){
							var content = [name]
							var skip = ["", "Timestamp","Latlng","lon", "lat", "link_google_maps", "Field1", "url_google_maps", "Tipo", "tessellate", "extrude", "visibility"];
							var properties = Object.keys(layer.properties);
							properties = properties.filter(function(key){
								return skip.indexOf(key) < 0;
							});
							properties.forEach(function(key){
	                content.push(key+": "+layer.properties[key]);
							})
							return {id: layer._id,type:name, label: content}
						}
					}
				
					foundMarkers = dbSearch.buildingsLayer.filter(filterByTerm).map(markerToAutocomplete)
					foundMarkers = foundMarkers.concat(dbSearch.acopioLayer.filter(filterByTerm).map(layertoAutocomplete("Acopio")));
					foundMarkers = foundMarkers.concat(dbSearch.alberguesLayer.filter(filterByTerm).map(layertoAutocomplete("Albergue")));
					foundMarkers = foundMarkers.concat(dbSearch.ofrezcoLayer.filter(filterByTerm).map(layertoAutocomplete("Ofrezco")));
					foundMarkers = foundMarkers.concat(dbSearch.necesitoLayer.filter(filterByTerm).map(layertoAutocomplete("Necesito")));
					foundMarkers = foundMarkers.concat(dbSearch.mapillaryLayer.filter(filterByTerm).map(layertoAutocomplete("Mapillary")));

					resolve(foundMarkers);
				},0);	
			})
		},
		hide:function(){
			$(".form-map").removeClass("active");
		},
		select:function(id,type){
			$(".form-map").removeClass("active");
			switch(type){
				case "Edificio":
					map.addLayer(buildingsLayer);  
					map.flyTo( dbSearch.buildingsLayer[id].coordinates,15 )
				break;
				case "Albergue":
					map.addLayer(alberguesLayer);  
					map.flyTo( dbSearch.alberguesLayer[id].coordinates,15 )
				break;
				case "Acopio":
					map.addLayer(acopioLayer);  
					map.flyTo( dbSearch.acopioLayer[id].coordinates,15 )
				break;
				case "Ofrezco":
					map.addLayer(ofrezcoLayer);  
					map.flyTo( dbSearch.ofrezcoLayer[id].coordinates,15 )
				break;
				case "Necesito":
					map.addLayer(necesitoLayer);  
					map.flyTo( dbSearch.necesitoLayer[id].coordinates,15)
				break;
				case "Mapillary":
					map.addLayer(mapillaryLayer);  
					map.flyTo( dbSearch.mapillaryLayer[id].coordinates,15)
				break;		      
			}

		}
	});

});