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
            playBeepPass();
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
    playIntroMusic();
    bird.y = canvas.height / 5;
	flowers.length = 0;
	gameOver = false;
	score = 0;
    gameLoop();
    hideRestartButton();
    document.getElementById('prizeContainer').style.display = 'none';
}

function showRestartButton() {
    document.getElementById('restartButton').style.display = 'block';
}

function hideRestartButton() {
    document.getElementById('restartButton').style.display = 'none';
}

function startGame() {
    playIntroMusic();
    document.getElementById('startButton').style.display = 'none';
    document.getElementById('start-message').style.display = 'none';
    gameLoop();
}

function checkWin(){
    if(score == 12){
        document.getElementById('prizeContainer').style.display = 'block';
        gameOver = true;
        playHappyMusic();
    }
}

canvas.addEventListener('click', () => {
    bird.velocity = bird.lift;
    playBeep();
});

// birdImage.onload = () => {
    // gameLoop();
// };

function playBeep() {
    // Create a new audio context
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create an oscillator node
    const oscillator = audioCtx.createOscillator();
    
    // Set the oscillator frequency to 440 Hz (A4 note)
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz is the frequency of A4
    
    // Set the oscillator type to sine wave
    oscillator.type = 'triangle';
    
    // Create a gain node to control the volume
    const gainNode = audioCtx.createGain();
    
    // Set the gain value to a reasonable level
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    
    // Connect the oscillator to the gain node
    oscillator.connect(gainNode);
    
    // Connect the gain node to the audio context's destination (i.e., the speakers)
    gainNode.connect(audioCtx.destination);
    
    // Start the oscillator
    oscillator.start();
    
    // Stop the oscillator after 0.5 seconds
    oscillator.stop(audioCtx.currentTime + 0.1);
}

function playBeepPass() {
    // Create a new audio context
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create an oscillator node
    const oscillator = audioCtx.createOscillator();
    
    // Set the oscillator frequency to 440 Hz (A4 note)
    oscillator.frequency.setValueAtTime(440, audioCtx.currentTime); // 440 Hz is the frequency of A4
    
    // Set the oscillator type to sine wave
    oscillator.type = 'sawtooth';
    
    // Create a gain node to control the volume
    const gainNode = audioCtx.createGain();
    
    // Set the gain value to a reasonable level
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    
    // Connect the oscillator to the gain node
    oscillator.connect(gainNode);
    
    // Connect the gain node to the audio context's destination (i.e., the speakers)
    gainNode.connect(audioCtx.destination);
    
    // Start the oscillator
    oscillator.start();
    
    // Stop the oscillator after 0.5 seconds
    oscillator.stop(audioCtx.currentTime + 0.2);
}

function playIntroMusic() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Frequencies for a simple melody (C4, D4, E4, G4, A4)
    const notes = [
        { frequency: 261.63, duration: 0.4 },  // C4
        { frequency: 293.66, duration: 0.4 },  // D4
        { frequency: 329.63, duration: 0.4 },  // E4
        { frequency: 392.00, duration: 0.4 },  // G4
        { frequency: 440.00, duration: 0.4 }   // A4
    ];

    let currentTime = audioCtx.currentTime;

    notes.forEach(note => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.frequency.setValueAtTime(note.frequency, currentTime);
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.1, currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);

        // Schedule the next note
        currentTime += note.duration + 0.1;  // Adding a small gap between notes
    });
}

function playHappyMusic() {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    // Frequencies and durations for a happy melody
    const notes = [
        { frequency: 264, duration: 0.2 },  // C4
        { frequency: 264, duration: 0.2 },  // C4
        { frequency: 297, duration: 0.4 },  // D4
        { frequency: 264, duration: 0.4 },  // C4
        { frequency: 352, duration: 0.4 },  // F4
        { frequency: 330, duration: 0.8 },  // E4
        { frequency: 264, duration: 0.2 },  // C4
        { frequency: 264, duration: 0.2 },  // C4
        { frequency: 297, duration: 0.4 },  // D4
        { frequency: 264, duration: 0.4 },  // C4
        { frequency: 396, duration: 0.4 },  // G4
        { frequency: 352, duration: 0.8 },  // F4
        { frequency: 264, duration: 0.2 },  // C4
        { frequency: 264, duration: 0.2 },  // C4
        { frequency: 528, duration: 0.4 },  // C5
        { frequency: 440, duration: 0.4 },  // A4
        { frequency: 352, duration: 0.4 },  // F4
        { frequency: 330, duration: 0.4 },  // E4
        { frequency: 297, duration: 0.4 },  // D4
        { frequency: 466, duration: 0.2 },  // A#4
        { frequency: 466, duration: 0.2 },  // A#4
        { frequency: 440, duration: 0.4 },  // A4
        { frequency: 352, duration: 0.4 },  // F4
        { frequency: 396, duration: 0.4 },  // G4
        { frequency: 352, duration: 1.6 }   // F4
    ];

    let currentTime = audioCtx.currentTime;

    notes.forEach(note => {
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.frequency.setValueAtTime(note.frequency, currentTime);
        oscillator.type = 'sine';  // You can experiment with 'square', 'sawtooth', 'triangle'
        gainNode.gain.setValueAtTime(0.1, currentTime);

        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);

        // Schedule the next note with a slight pause
        currentTime += note.duration + 0.1;  // Adding a small gap between notes
    });
}