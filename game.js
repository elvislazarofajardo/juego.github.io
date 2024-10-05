const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const scoreBoard = document.getElementById('scoreBoard');
const hitSound = document.getElementById('hitSound');
const pointSound = document.getElementById('pointSound');

let player, obstacles = [], score, gameInterval, obstacleInterval;

canvas.width = 400;
canvas.height = 600;

// Clase para el jugador
class Player {
    constructor() {
        this.width = 30;
        this.height = 30;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 5;
        this.color = '#3498db';
    }

    moveLeft() {
        if (this.x > 0) this.x -= this.speed;
    }

    moveRight() {
        if (this.x + this.width < canvas.width) this.x += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Clase para los obstáculos
class Obstacle {
    constructor() {
        this.width = Math.random() * 60 + 20;
        this.height = 20;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.speed = Math.random() * 3 + 2;
        this.color = this.getRandomColor();
    }

    getRandomColor() {
        const colors = ['#e74c3c', '#2ecc71', '#f39c12', '#8e44ad'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    move() {
        this.y += this.speed;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

// Iniciar el juego
function startGame() {
    player = new Player();
    obstacles = [];
    score = 0;
    scoreBoard.innerText = `Puntaje: ${score}`;
    startButton.style.display = 'none';

    gameInterval = setInterval(updateGame, 1000 / 60);
    obstacleInterval = setInterval(createObstacle, 1500);
}

// Actualizar el juego en cada frame
function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();

    obstacles.forEach((obstacle, index) => {
        obstacle.move();
        obstacle.draw();

        // Remover obstáculos fuera del canvas
        if (obstacle.y > canvas.height) {
            obstacles.splice(index, 1);
            score += 1;
            pointSound.play();  // Reproducir sonido de punto
            scoreBoard.innerText = `Puntaje: ${score}`;
        }

        // Verificar colisiones
        if (checkCollision(player, obstacle)) {
            endGame();
        }
    });
}

// Crear nuevos obstáculos
function createObstacle() {
    obstacles.push(new Obstacle());
}

// Verificar colisiones
function checkCollision(player, obstacle) {
    return !(player.y > obstacle.y + obstacle.height || 
             player.y + player.height < obstacle.y || 
             player.x > obstacle.x + obstacle.width || 
             player.x + player.width < obstacle.x);
}

// Finalizar el juego
function endGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    hitSound.play();  // Reproducir sonido de colisión
    alert(`¡Juego terminado! Puntaje final: ${score}`);
    startButton.style.display = 'block';
}

// Controles para teclado
document.addEventListener('keydown', (event) => {
    if (event.code === 'ArrowLeft') {
        player.moveLeft();
    } else if (event.code === 'ArrowRight') {
        player.moveRight();
    }
});

// Soporte para pantallas táctiles
canvas.addEventListener('touchstart', (event) => {
    const touchX = event.touches[0].clientX - canvas.getBoundingClientRect().left;
    if (touchX < canvas.width / 2) {
        player.moveLeft();
    } else {
        player.moveRight();
    }
});

// Iniciar juego con botón
startButton.addEventListener('click', startGame);
