// dependencies
var gjv = require("geojson-validation");
var cartoDB = require("cartodb");


var sql = new cartoDB.SQL({user: "repubikla", api_key: "1f4f5ee0324cc1fa98e53f398fa922767510ce27"});

var table = "mapeo_comunitario";


var getPoints = function(callback){
    sql.execute("SELECT ST_X(the_geom) as lng, ST_Y(the_geom) as lat,comment,cartodb_id as id,type,nivel_emergencia FROM " + table ).done(function(data) {
        var json;

        var featureCollection = {
            "type": "FeatureCollection",
            "features": []
        };
        
        for(var i = 0; i < data.rows.length; i++){
            try{
                json = data.rows[i];
                
                var properties = {};
                properties.type = json.type;
                properties.gid = json.id;
                properties.comment = json.comment;
                properties.nivel_emergencia = json.nivel_emergencia;

                featureCollection.features.push({
                    "type": "Feature",
                    "geometry": {
                        "type": "Point",
                        "coordinates": [json.lng, json.lat]
                    },
                    "properties": properties
                });
            }catch(err){
                console.log("error", err);
            }
        }
    
        callback(featureCollection);
    });
};


function insertPointNoGeo(point, callback){
    console.log("inserting point");

    if(gjv.valid(point)){
        var geojson = point;

        var query = "INSERT INTO mapeo_colaborativo_no_geo(personas_afectadas,personas_heridas_fallecidas,tipo_apoyo,contacto,info_adicional,tipo_dano,ciudad_localidad,delegacion_municipio,calle,numero_ext,entre_calles,codigo_postal) VALUES ";
        
        query += "('" + geojson.properties.personas_afectadas + "','" + geojson.properties.personas_heridas_fallecidas + "'";
        query += ",'" + geojson.properties.tipo_apoyo + "','" + geojson.properties.contacto + "','" + geojson.properties.info_adicional + "','" + geojson.properties.tipo_dano+ "'";
        query += ",'" + geojson.properties.ciudad_localidad + "','" + geojson.properties.delegacion_municipio + "','" + geojson.properties.calle + "','" + geojson.properties.numero_ext + "'";
        query += ",'" + geojson.properties.entre_calles + "','" + geojson.properties.codigo_postal + "')";
        query += " RETURNING cartodb_id";
        
        sql.execute(query).done(function(data) {
            geojson.properties.gid = data.rows[0].cartodb_id;

            console.log("inserted point", geojson.properties.gid);
            callback(geojson);
        }).error(function(info){
            console.log("error inserting point", info);
            geojson.properties.gid = -1;

            callback(geojson);
        });

    }
}



function insertPoint(point, callback){
    console.log("inserting point");

    if(gjv.valid(point)){
        var geojson = point;

        var query = "INSERT INTO " + table + "(the_geom,personas_afectadas,personas_heridas_fallecidas,tipo_apoyo,contacto,info_adicional,tipo_dano) VALUES (ST_SetSRID(ST_MakePoint(";
        query += geojson.geometry.coordinates[1] + "," + geojson.geometry.coordinates[0] + "),4326),'" + geojson.properties.personas_afectadas + "','" + geojson.properties.personas_heridas_fallecidas + "'";
        query += ",'" + geojson.properties.tipo_apoyo + "','" + geojson.properties.contacto + "','" + geojson.properties.info_adicional + "','" + geojson.properties.tipo_dano+ "')";
        query += " RETURNING cartodb_id";
        

        sql.execute(query).done(function(data) {
            geojson.properties.gid = data.rows[0].cartodb_id;

            console.log("inserted point", geojson.properties.gid);
            callback(geojson);
        }).error(function(info){
            console.log("error inserting point", info);
            geojson.properties.gid = -1;

            callback(geojson);
        });
    }
}


module.exports = {
    getPoints: getPoints,
    insertPoint: insertPoint,
    insertPointNoGeo: insertPointNoGeo
};