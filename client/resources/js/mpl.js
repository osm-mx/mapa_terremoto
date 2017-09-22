window.searchMplImages = function(link){
    console.log("getting mpl data");
    
    var clearLayers = false;
	if(link==null){
		$("#chargingDialog").modal('show');
		link = "https://a.mapillary.com/v3/images?start_time=2017-09-20&client_id=Z0l2SnYzeXRIRDBpeC1xUWNTYTdqQTpiMzFiNTBiMWFkNWJkOWVl&bbox=-100.4727,17.7853,-96.1606,20.1359";
		clearLayers = true;
	}

	$.get( link ).done(function(result, textStatus, jqXHR){
		window.addMplData(result, clearLayers);

		var linksHeaders = jqXHR.getResponseHeader("link").split(",");
        for(var i = 0; i < linksHeaders.length; i++){
            if(linksHeaders[i].includes("rel=\"next")){
                var regex = /http.*>;/i.exec(linksHeaders[i]);
                var next_link = regex[0].slice(0,regex[0].length-2);

				window.searchMplImages(next_link);
                break;
            }else if(i==linksHeaders.length-1){
				$("#chargingDialog").modal('hide');
            }
        }
	}).fail(function(err){
		console.log("Error looking in mapillary", err);
	});
};



/* global $ moment Mapillary L*/