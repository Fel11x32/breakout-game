let board;
let boardWidth = 500;
let boardHeight = 500;
let context;

let playerWidth = 80;
let playerHeight = 10;
let player = {
	x : boardWidth / 2 -  playerWidth / 2,
	y : boardHeight - playerHeight - 5,
	width : playerWidth,
	height : playerHeight,
};

let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = -2;
let ballVelocityY = 1;
let ball = {
	x : boardWidth / 2,
	y : boardHeight / 2,
	width : ballWidth,
	height : ballHeight,
}

function outOfBounds(xPosition) {
	return (xPosition < 0 || xPosition + player.width > boardWidth);
}

function playerMove(event) {
	let mouseX = event.clientX - board.offsetLeft;
	let nextPlayerX = mouseX - player.width / 2;

	if (!outOfBounds(nextPlayerX)) {
		player.x = nextPlayerX;
	}
}

// Обнаружение колизии
function detectCollision(rectA, rectB) {
	return (
		rectA.x < rectB.x + rectB.width &&
		rectA.x + rectA.width > rectB.x &&
		rectA.y < rectB.y + rectB.height &&
		rectA.y + rectA.height > rectB.y
	);
}

function topCollision(ball, block) {
	return (
		detectCollision(ball, block) &&
		ball.y + ball.height <= block.y + Math.abs(ballVelocityY)
	);
}

function bottomCollision(ball, block) {
	return (
		detectCollision(ball, block) &&
		ball.y >= block.y + block.height - Math.abs(ballVelocityY)
	);
}

function leftCollision(ball, block) {
	return (
		detectCollision(ball, block) &&
		ball.x + ball.width <= block.x + Math.abs(ballVelocityX)
	);
}

function rightCollision(ball, block) {
	return (
		detectCollision(ball, block) &&
		ball.x >= block.x + block.width - Math.abs(ballVelocityX)
	);
}

function update() {
	requestAnimationFrame(update);
	context.clearRect(0, 0, boardWidth, boardHeight);

	// игрок
	context.fillStyle = "yellow";
	context.fillRect(player.x, player.y, player.width, player.height);

	// мяч
	context.fillStyle = "white";
	ball.x += ballVelocityX;
	ball.y += ballVelocityY;
	context.fillRect(ball.x, ball.y, ball.width, ball.height);

	// отскок мяча от стены
	if (ball.y <= 0) {
		ballVelocityY *= -1;
	} else if (ball.x <= 0 || (ball.x + ball.width) >= boardWidth) {
		ballVelocityX *= -1;
	} else if (ball.y + ball.height >= boardHeight) {
		// game over
	}

	// отскок мяча от платформы
	if (topCollision(ball, player)) {
		ballVelocityY *= -1;
	} else if (leftCollision(ball, player)) {
		ballVelocityX *= -1;
	} else if (rightCollision(ball, player)) {
		ballVelocityX *= -1;
	}
}

// Функция отрисовки
window.onload = function () {
	board = document.getElementById("game-canvas");
	board.height = boardHeight;
	board.width = boardWidth;
	context = board.getContext("2d");

	context.fillStyle = "yellow";
	context.fillRect(player.x, player.y, player.width, player.height);

	requestAnimationFrame(update);
	document.addEventListener("mousemove", playerMove)
};
