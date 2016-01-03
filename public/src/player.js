require([], function () {
	Q.Sprite.extend('Actor', {
		init: function (p) {
			this._super(p, {
				update: true
			});
			
			var temp = this;
			setInterval(function () {
				if (!temp.p.update) {
					temp.destroy();
				}
				temp.p.update = false;
			}, 3000);
		}
	});
	
	Q.Sprite.extend('Player', {
		init: function (p) {
			this._super(p, {
				sheet: 'player'
			});
 
      this.add('2d, platformerControls, animation');
    },
	step: function (dt) {
			if (Q.inputs['up']) {
				this.p.vy = -200;
			} else if (Q.inputs['down']) {
				this.p.vy = 200;
			} else if (!Q.inputs['down'] && !Q.inputs['up']) {
				this.p.vy = 0;
			}
			this.p.socket.emit('update', { playerId: this.p.playerId, x: this.p.x, y: this.p.y, sheet: this.p.sheet });
		}
	});
});