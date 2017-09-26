var request = require('request');
var parse = require('csv-parse');


var input = '#Welcome\n"1","2","3","4"\n"a","b","c","d"';


request("https://storage.googleapis.com/sismocdmx/danios/danios.csv?cm.ttl=600", function(err, response, body){
	if(err){
		return console.log("Error getting data");
	}
	parse(body, {}, function(err, output){
  		console.log(output)
	});
});
