var Q = Quintus({audioSupported: [ 'wav','mp3' ]})
      .include('Sprites, Scenes, Input, 2D, Anim, Touch, UI, Audio')
      .setup({ maximize: true })
      .enableSound()
      .controls().touch();
 
Q.gravityY = 0;

require(['socket.io/socket.io.js']);

var players = [];
var socket = io.connect('http://localhost:8080');
var UiPlayers = document.getElementById("players");
var selfId, player;
 
var objectFiles = [
  './src/player'
];
 
require(objectFiles, function () {
	function setUp (stage) {
		socket.on('count', function (data) {
			UiPlayers.innerHTML = 'Players: ' + data['playerCount'];
		});
		socket.on('connected', function (data) {
			selfId = data['playerId'];
			player = new Q.Player({ playerId: selfId, x: 50, y: 50, socket: socket });
			stage.insert(player);
			stage.add('viewport').follow(player);
		});
	}
	
	socket.on('updated', function (data) {
		var actor = players.filter(function (obj) {
			return obj.playerId == data['playerId'];
		})[0];
		if (actor) {
			actor.player.p.x = data['x'];
			actor.player.p.y = data['y'];
			actor.player.p.sheet = data['sheet'];
			actor.player.p.update = true;
		} else {
			var temp = new Q.Actor({ playerId: data['playerId'], x: data['x'], y: data['y'], sheet: data['sheet'] });
			players.push({ player: temp, playerId: data['playerId'] });
			stage.insert(temp);
		}
	});
	Q.scene('arena', function (stage) {
		stage.collisionLayer(new Q.TileLayer({ dataAsset: '/maps/arena.json', sheet: 'tiles' }));
		setUp(stage);
	});
	
	var files = [
	'/images/tiles.png',
    '/maps/arena.json',
    '/images/sprites.png',
    '/images/sprites.json'
	];
	
	Q.load(files.join(','), function () {
		Q.sheet('tiles', '/images/tiles.png', { tilew: 32, tileh: 32 });
		Q.compileSheets('/images/sprites.png', '/images/sprites.json');
		Q.stageScene('arena', 0);
	});
});