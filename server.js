"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var connected = {}; // this will contain information about all connected units

app.get('/', function(req, res){
	res.sendFile('index.html', { root: __dirname });
});
app.use('/milsymbol', express.static(__dirname + '/node_modules/milsymbol/dist/'));
app.use('/openlayers', express.static(__dirname + '/node_modules/openlayers/dist'));
app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client'));

io.on('connection', function(socket){
	var urn = parseInt(Math.random()*1000000);
	while(connected[urn]){ // making sure that the urn is not already connected
		urn = parseInt(Math.random()*1000000);
	}
	socket.emit('connected', urn) // so this goes only to the connected one
	
  	for (let key in connected){ //sending out information about all other connected units
		if(connected[key].k012)socket.emit('K01.2', connected[key].k012);// sending out units information
		if(connected[key].k051)socket.emit('K05.1', connected[key].k051);// sending out units positions
	}
	connected[urn] = {'k012':false,'k051':false}; // adding this unit to connected
	//k011 is sort of VMF message type K01.2
	//k051 is sort of VMF message type K05.1

	socket.on('K01.2', function(msg){ // this is broadcasted to everyone
		socket.broadcast.emit('K01.2', msg);
		connected[urn].k012 = msg;
	});	
	socket.on('K05.1', function(msg){ // this is broadcasted to everyone
		socket.broadcast.emit('K05.1', msg);
		connected[urn].k051 = msg;
	});
	
	socket.on('disconnect', function () {
		io.emit('disconnected', urn);
    	delete connected[urn];
  	});
});

var port = 8080;
http.listen(port, function(){
	console.log('listening on *:'+port);
});