let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

let playerWidth = 80;
let playerHeight = 10;
let playerVelocity = 10;

let player = {
	x : boardWidth / 2 -  playerWidth / 2,
	y : boardHeight - playerHeight - 5,
	width : playerWidth,
	height : playerHeight,
	velocity : playerVelocity
};

window.onload = function () {
	board = document.getElementById("game-canvas");
	board.height = boardHeight;
	board.width = boardWidth;
	context = board.getContext("2d");

	context.fillStyle = "yellow";
	context.fillRect(player.x, player.y, player.width, player.height);

	requestAnimationFrame(update);
	document.addEventListener("keydown", playerMove)
};

function update() {
	requestAnimationFrame(update);
	context.clearRect(0, 0, boardWidth, boardHeight);

	context.fillStyle = "yellow";
	context.fillRect(player.x, player.y, player.width, player.height);
}

function outOfBounds(xPosition) {
	return (xPosition < 0 || xPosition + player.width > boardWidth);
}

function playerMove(event) {
	if (event.code === "ArrowLeft") {
		// player.x -= player.velocity;
		let nextPlayer = player.x - player.velocity
		if (!outOfBounds(nextPlayer)) {
			player.x = nextPlayer;
		}
	} else if (event.code === "ArrowRight") {
		// player.x += player.velocity;
		let nextPlayer = player.x + player.velocity
		if (!outOfBounds(nextPlayer)) {
			player.x = nextPlayer;
		}
	}
}