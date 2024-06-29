const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const bird = {
    x: 50,
    y: canvas.height / 5,
    width: 120,
    height: 80,
    gravity: 0.3,
    lift: -8,
    velocity: 0,
};

const flowers = [];
const flowerImage = new Image();
flowerImage.src = 'flower.png'; // Replace with your flower image path

const birdImage = new Image();
birdImage.src = 'bird.png'; // Replace with your bird image path

let score = 0;
let gameOver = false;

function drawBird() {
    context.drawImage(birdImage, bird.x, bird.y, bird.width, bird.height);
}

function drawFlower(flower) {
    context.drawImage(flowerImage, flower.x, flower.y, flower.width, flower.height);
}

function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
    if (bird.y + bird.height > canvas.height || bird.y < 0) {
        gameOver = true;
    }
}

function createFlower() {
    const flowerGap = 200;
    const flowerHeight = Math.random() * (canvas.height - flowerGap);
    flowers.push({
        x: canvas.width,
        y: flowerHeight,
        width: 60,
        height: 60,
        passed: false,
    });
}

function updateFlowers() {
    flowers.forEach((flower, index) => {
        flower.x -= 2;
        if (flower.x + flower.width < 0) {
            flowers.splice(index, 1);
            score++;
        }
    });
}

function checkCollision() {
    flowers.forEach(flower => {
        if (
            bird.x < flower.x + flower.width &&
            bird.x + bird.width > flower.x &&
            bird.y < flower.y + flower.height &&
            bird.y + bird.height > flower.y
        ) {
            gameOver = true;
        }
    });
}

function drawScore() {
    context.fillStyle = 'white';
    context.font = '24px Arial';
    context.fillText(`Meses: ${score}`, 10, 30);
}

function gameLoop() {
    if (gameOver) {
		showRestartButton();
        return;
    }

    context.clearRect(0, 0, canvas.width, canvas.height);

    drawBird();
    updateBird();

    if (flowers.length === 0 || flowers[flowers.length - 1].x < canvas.width - 300) {
        createFlower();
    }

    flowers.forEach(drawFlower);
    updateFlowers();
    checkCollision();
    drawScore();
    checkWin();
    requestAnimationFrame(gameLoop);
}

function restartGame() {

    bird.y = canvas.height / 5;
	flowers.length = 0;
	gameOver = false;
	score = 0;
    gameLoop();
    hideRestartButton();
}

function showRestartButton() {
    document.getElementById('restartButton').style.display = 'block';
}

function hideRestartButton() {
    document.getElementById('restartButton').style.display = 'none';
}

function startGame() {
    document.getElementById('startButton').style.display = 'none';
    gameLoop();
}

function checkWin(){
    if(score == 3){
        document.getElementById('prizeContainer').style.display = 'block';
        gameOver = true;
    }
}

canvas.addEventListener('click', () => {
    bird.velocity = bird.lift;
});

// birdImage.onload = () => {
    // gameLoop();
// };
