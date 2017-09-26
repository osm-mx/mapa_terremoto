var utils = require("./utils");

var documentId = "1ijleBcHJH_3V2nbMeXTjH4hTDYsjcdodYvHqhTc8C8c";

/*
*
*	EDIFICIOS
* */
function updateEdificiosOficialData(){
	// oficial
	var options = {
		documentId: documentId,
		spreadsheet: "Derrumbes - Oficial (datos.gob.mx)",
		skipColumns: [],
		renameColumns: {}
	};

	utils.getGeojsonSheet(options, function(err, data){
		if(err){
			return console.log("Error getting spreadsheet", err);
		}

		utils.writeFile("gob.mx/edificios_oficial.geojson", data);
	});
}


function updateEdificiosCrowdData(){
	// crowd
	var options = {
		documentId: documentId,
		spreadsheet: "Daños y derrumbes - Colaborativo",
		skipColumns: [],
		renameColumns: {}
	};

	utils.getGeojsonSheet(options, function(err, data){
		if(err){
			return console.log("Error getting spreadsheet", err);
		}

		utils.writeFile("gob.mx/edificios_crowd.geojson", data);
	});
}


/*
*
*	ALBERGUES
* */
function updateAlberguesCrowdData(){
	// crowd
	var options = {
		documentId: documentId,
		spreadsheet: "Albergues - Colaborativo",
		skipColumns: ["id", "fechaDeCreación", "últimaActualización"],
		renameColumns: {}
	};

	utils.getGeojsonSheet(options, function(err, data){
		if(err){
			return console.log("Error getting spreadsheet", err);
		}

		utils.writeFile("gob.mx/albergues_crowd.geojson", data);
	});
}


function updateAlberguesOficialData(){
	// oficial
	var options = {
		documentId: documentId,
		spreadsheet: "Albergues - Oficial",
		skipColumns: [],
		renameColumns: {"dirección_completa": "dirección"}
	};

	utils.getGeojsonSheet(options, function(err, data){
		if(err){
			return console.log("Error getting spreadsheet", err);
		}

		utils.writeFile("gob.mx/albergues_oficial.geojson", data);
	});
}


/*
*
*	ACOPIO
* */
function updateAcopioCrowdData(){
	// crowd
	var options = {
		documentId: documentId,
		spreadsheet: "Centros de Acopio - Colaborativo",
		skipColumns: ["id", "id2", "estatus", "actualizadoPor"],
		renameColumns: {
			"nombreDelCentroDeAcopio": "nombre",
			"dirección(agregada)": "direccion",
			"últimaActualización": "actualización",
			"fechaDeCreación": "creado"
		}
	};
	utils.getGeojsonSheet(options, function(err, data){
		if(err){
			return console.log("Error getting spreadsheet", err);
		}

		utils.writeFile("gob.mx/acopio_crowd.geojson", data);
	});
}


function updateAcopioOficialData(){
	// oficial
	var options = {
		documentId: documentId,
		spreadsheet: "Centros de Acopio - Oficial (datos.gob.mx)",
		skipColumns: [],
		renameColumns: {}
	};

	utils.getGeojsonSheet(options, function(err, data){
		if(err){
			return console.log("Error getting spreadsheet", err);
		}

		utils.writeFile("gob.mx/acopio_oficial.geojson", data);
	});
}


module.exports = {
	updateAcopioCrowdData: updateAcopioCrowdData,
	updateAcopioOficialData: updateAcopioOficialData,
	updateAlberguesOficialData: updateAlberguesOficialData,
	updateAlberguesCrowdData: updateAlberguesCrowdData,
	updateEdificiosCrowdData: updateEdificiosCrowdData,
	updateEdificiosOficialData: updateEdificiosOficialData,
	updateAll: function(){
		console.log("Updating all resources from gob.mx");

		updateAcopioCrowdData();
		updateAcopioOficialData();
		updateAlberguesOficialData();
		updateAlberguesCrowdData();
		updateEdificiosCrowdData();
		updateEdificiosOficialData();
	}
}
