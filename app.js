var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
 
app.use(express.static(__dirname + '/public'));
 
app.get('/', function(req, res){
  res.render('/index.html');
});
 
var playerCount = 0;
var id = 0;
var counter =10;
 
io.on('connection', function (socket) {
	playerCount++;
	id++;
	setTimeout(function () {
		socket.emit('connected', { playerId: id });
		io.emit('count', { playerCount: playerCount });
		var proses = setInterval(function() {
			if(counter >= 1){
				counter--;
				io.emit('timer', { playerCount: counter});
			}
			else{
				counter = 10;
				clearInterval(proses);
			}
		}, 1000);
	}, 1500);
	
	socket.on('disconnect', function () {
		playerCount--;
		io.emit('count', { playerCount: playerCount });
	});
	
	socket.on('update', function (data) {
		socket.broadcast.emit('updated', data);
	});
});
 
server.listen(8080);
console.log("Multiplayer app listening on port 8080");


