"use strict";
var express = require('express');
var app = express();
var fs = require('fs'); 

// Use HTTP ------------------------------------------------------------------------------
/*
var port = 8080;
var server = require('http').Server(options,app);
*/
// Use HTTPS -----------------------------------------------------------------------------

var port = 443;
var options = {
  key: fs.readFileSync(__dirname + '/tail.spatialillusions.com.ssl/tail.spatialillusions.com.key'), //Path to your key
  cert: fs.readFileSync(__dirname + '/tail.spatialillusions.com.ssl/tail_spatialillusions_com.crt') //Path to your certificate
};
var server = require('https').Server(options,app);
// Redirect from http port 80 to https
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    res.end();
}).listen(80);

// Initiate Socket -----------------------------------------------------------------------
var io = require('socket.io')(server);
var connected = {}; // this will contain information about all connected units

// Setting up where to find files --------------------------------------------------------
app.get('/', function(req, res){
	res.sendFile('index.html', { root: __dirname });
});
app.use('/milsymbol', express.static(__dirname + '/node_modules/milsymbol/dist/'));
app.use('/openlayers', express.static(__dirname + '/node_modules/openlayers/dist'));
app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client'));

// Socket handling -----------------------------------------------------------------------
io.on('connect', function(socket){
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

	//TODO just use one message type with a header telling what message it is
	socket.on('K01.2', function(msg){ // this is broadcasted to everyone
		socket.broadcast.emit('K01.2', msg);
		connected[urn].k012 = msg;
	});	
	socket.on('K05.1', function(msg){ // this is broadcasted to everyone
		socket.broadcast.emit('K05.1', msg);
		connected[urn].k051 = msg;
	});
	
	//TODO, send this as a K01.2 with a disconnected property
	socket.on('disconnect', function () {
		if(connected[urn].k012 || connected[urn].k051){
			io.emit('disconnected', urn);
		}
    	delete connected[urn];
  	});
});

// Now lets start the server -------------------------------------------------------------
server.listen(port, function(){
	console.log('listening on *:'+port);
});