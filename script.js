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
let ballVelocityX = Math.random() > 0.5 ? 2 : -2; // Случайный выбор направления по X
let ballVelocityY = Math.random() * 2 + 1;       // Случайная скорость по Y
let ball = {
	x : boardWidth / 2,
	y : boardHeight / 2,
	width : ballWidth,
	height : ballHeight,
}

let blocksArray = [];
let blocksWidth = 50;
let blocksHeight = 10;
let blocksColumns = 8;
let blocksRows = 4;
let blocksMaxRows = 10;
let blocksCount = 0;
let startBlockX = 15;
let startBlockY = 45;

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

// Создание масивва плиток
function createBlock() {
	blocksArray = [];
	for (let col = 0; col < blocksColumns; col++) {
		 for (let row = 0; row < blocksRows; row++) {
			 let block = {
				 x: startBlockX + col * blocksWidth + col * 10,
				 y: startBlockY + row * blocksHeight + row * 10,
				 width: blocksWidth,
				 height: blocksHeight,
				 break: false,
			 }
			 blocksArray.push(block);
		}
	}
	blocksCount = blocksArray.length;
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

		let hitPos = (ball.x + ball.width / 2) - (player.x + player.width / 2);
		ballVelocityX += hitPos * 0.04; // Увеличиваем изменение X в зависимости от 2попадания

		ballVelocityX = Math.max(-5, Math.min(5, ballVelocityX));
		ballVelocityY = Math.max(-5, Math.min(5, ballVelocityY));
	} else if (leftCollision(ball, player)) {
		ballVelocityX *= -1;
	} else if (rightCollision(ball, player)) {
		ballVelocityX *= -1;
	}

	context.fillStyle = "blue";
	blocksArray.forEach((block) => {
		if (!block.break) {
			if (topCollision(ball, block) || bottomCollision(ball, block)) {
				block.break = true;
				ballVelocityY *= -1;
				blocksCount -= 1;
			} else if (leftCollision(ball, block) || rightCollision(ball, block)) {
				block.break = true;
				ballVelocityX *= -1;
				blocksCount -= 1;
			}
			context.fillRect(block.x, block.y, block.width, block.height);
		}
	});
}

// Функция отрисовки
window.onload = function () {
	board = document.getElementById("game-canvas");
	board.height = boardHeight;
	board.width = boardWidth;
	context = board.getContext("2d");

	requestAnimationFrame(update);
	document.addEventListener("mousemove", playerMove);

	createBlock();
};
