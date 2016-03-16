var http = require('http'),
    express = require('express'),
    cons = require('consolidate'),
    mongo =  require('mongodb')	

var server = http.createServer(function (request, response){
	response.writeHead(200, {"Content-Type":"text/plain"});
	response.end("Hello, world Good night");

});


server.listen(9000);

console.log("serevr started on localhost:9000");
