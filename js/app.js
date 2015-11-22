
/* Initial jquery to start the game when the user clicks the Start button. */
$('#start').click(function() {
	game.startGame(3,0);
});

/* Game class used to manage the state of the game. */
var Game = function(state) {
	this.gameState = state;
	this.allEnemies = [];
};

/* function used to determine if the player has run out of lives and if so, changes the state of the game. */
Game.prototype.checkState = function() {
	if (player.lifeCount < 1) {
	this.gameOver();
	}
};

/* function used to  update the players life and key counts. */
Game.prototype.updateCounts = function() {
	$('#lifeCount').empty();
	$('#lifeCount').append(player.lifeCount);
	$('#keyCount').empty();
	$('#keyCount').append(player.keyCount);
};

/* function used to reset the objects and counts once it's game over. */
Game.prototype.gameOver = function() {
	this.allEnemies = [];
	player.resetPlayerPosition(200,400);
	game.updateCounts();
};

/* function used to start the game by checking if the game is currently stopped, if so then it changes the game state to playing and adds enemies. */
Game.prototype.startGame = function(lives, keys) {
	if (this.gameState = 'stopped') {
		this.gameState = 'playing';
		/* This condition ensures that only 3 enemies can be added so that if the user clicks on the start button multiple times the game wont spawn excessive amounts of the enemies. */
		if (this.allEnemies.length < 3) {
			for (var i = 0; i < 3; i++) {
				this.allEnemies.push(new Enemy(-60, 60 + 85 * i,50,50,game.random(100,600)));
			}
		}
	}
	player.lifeCount = lives;
	player.keyCount = keys;
	game.updateCounts();
};

/* function to generate a random range. */
Game.prototype.random = function(low,high) {
	var range = high - low + 1;
	return Math.floor(Math.random() * range) + low;
};

/* The super class for all entities within the game. */
var Entity = function(x,y,width,height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
};

/* Generic function for rendering all entities to the canvas. */
Entity.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Generic function for checking collisions between entities. */ 
Entity.prototype.collisionCheck = function(entity) {
	if (entity.x < this.x + this.width && entity.x + entity.width > this.x && entity.y < this.y + this.height && entity.height + entity.y > this.y)	{ 
		return true;
	}
};

/* Create Key subclass of Entity */
var Key = function(x,y,width,height) {
	Entity.call(this,x,y,width,height);
	this.sprite = 'images/Key.png';
};

/* Allowing the Key subclass to inherit from the Entity super class. */
Key.prototype = Object.create(Entity.prototype);
Key.prototype.constructor = Key;

/* Key function to reset the position of the key to a random column & row within a canvas. */
Key.prototype.resetKeyPosition = function() {
	var colWidth = 101, rowHeight = 83;
	this.x = colWidth * game.random(0,4);
	this.y = rowHeight * game.random(1,3) + 50;
};

/* Create Enemy subclass of Entity */
var Enemy = function(x,y,width,height,speed) {
	Entity.call(this,x,y,width,height);
	this.speed = speed;
	this.sprite = 'images/enemy-bug.png';
};

/* Allowing the Enemy subclass to inherit from the Entity super class. */
Enemy.prototype = Object.create(Entity.prototype);
Enemy.prototype.constructor = Enemy;

/* Function to update the enemies position, checks if the enemy has gone off screen, if so then it resets the enemies position to the left again. */
Enemy.prototype.update = function(dt,canvasWidth) {
	this.x = this.x + this.speed * dt;
	if (this.x > canvasWidth) {
		this.x = -60;
		this.speed = game.random(100,600);
	}

/* Checks for collisions between the player and the enemies. If a collision is found, it will update the life count of the player and reset the players position. */
	if (this.collisionCheck(player)) {
		player.resetPlayerPosition(200,400);
		player.lifeCount = player.lifeCount - 1;
		game.updateCounts();
		game.checkState();
	}
};

/* Create Player subclass of Entity */
var Player = function(x,y,width,height) {
	Entity.call(this,x,y,width,height);
	this.sprite = 'images/char-boy.png';
};

/* Allowing the Player class to inherit from the Entity super class. */
Player.prototype = Object.create(Entity.prototype);
Player.prototype.constructor = Player;

/* Function to check the collions between player and key. */
Player.prototype.update = function() {

	if (this.collisionCheck(key)) {
		key.resetKeyPosition();
		this.keyCount = this.keyCount + 1;
		game.updateCounts();
	}
};

/* Function to reset the player position. */
Player.prototype.resetPlayerPosition = function(x,y) {
	this.x = x;
	this.y = y;
};

/*Function to handle the input keys from the user. This checks if the player is next to the border of the canvas or the river. If not then it will allow the key move to occur. */
Player.prototype.handleInput = function(keyPressed) {
	switch(keyPressed) {
		case 'left':
			if (this.x > 0) {
				this.x = this.x - 100;
			}
			break;
		case 'right':
			if (this.x < 400) {
				this.x = this.x + 100;
			}
			break;
		case 'up':
			if (this.y < 100) {
				this.resetPlayerPosition(200,400);
			} else {
				this.y = this.y - 90;
			}
			break;
		case 'down':
			if (this.y < 400) {
				this.y = this.y + 90;
				}
			break;
	}
};

/* Create and instance of the Game,Player & Key subclasses. */
var game = new Game('stopped');
var player = new Player(200,400,100,50);
var key = new Key(200,50,100,50);

// This listens for key presses and sends the keys to your 
// Player.handleInput() method. You don't need to modify this. 
	document.addEventListener('keyup', function(e) {
		var allowedKeys = {
			37: 'left',
			38: 'up',
			39: 'right',
			40: 'down'
		};
		var keyPressed = allowedKeys[e.keyCode];
			player.handleInput(keyPressed);
	});