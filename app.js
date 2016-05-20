var express = require ("express");
var mongoose = require ("mongoose");
var request = require ("request");
var app = express();
var aData = null;


mongoose.connect("mongodb://localhost/Santander");
var db = mongoose.connection;
var Document = null;
db.on("error", console.error.bind(console,"Connection error:"));
db.once('open',function(callback){

	var SAN_schema = mongoose.Schema({
	fecha: String,
	abierto: Number,
	alto: Number,
	bajo: Number,
	cierre: Number,
	volumen:Number,
	});
	Document = mongoose.model('Document', SAN_schema);

	var urlSantander = "http://spancrow.hol.es/json/MC_SAN.json";
	request({
		url: urlSantander,
		json: true
	}, function (error, response, body){

		if (!error && response.statusCode == 200){
		var parseo = body.dataset.data;
		//console.log(parseo)
		var jsonString=[];
		for(var i = 0 ; i < parseo.length; i++){
			var jsonDato={};
			
				jsonDato.fecha = String(parseo[i][0]);
				jsonDato.abierto = parseFloat(parseo[i][1]);
				jsonDato.alto = parseFloat(parseo[i][2]);
				jsonDato.bajo = parseFloat(parseo[i][3]);
				jsonDato.cierre = parseFloat(parseo[i][4]);
				jsonDato.volumen = parseFloat(parseo[i][5]);
				jsonString.push(jsonDato);
			}
	
			var jsonArrayValor = JSON.parse(JSON.stringify(jsonString));
			
			var aDocs = jsonArrayValor;
			Document.count({},function(err,count){
			if(count=0){
				for (var n = 0; n < aDocs.length; n++){
				var docToAdd = new Document(aDocs[n]);
				docToAdd.save(function(error,docToAdd){
					if (error) return console.error(error)
				});
			}
			}
			else{
				var docToAdd = new Document(aDocs[n=0]);
				//var docToAdd = new Document(aDocs[n]);
				docToAdd.save(function(error,docToAdd)
				{
					//if (error) return console.error(error)
				});
			}
			
			});
			console.log(aDocs)
		
		}
	});
});



app.listen(8080);
console.log("Servidor conectado puerto 8080");