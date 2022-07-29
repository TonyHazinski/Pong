const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d")
const canvasWidth = 600;
const canvasHeight = 600;
let running = false;

function randomNumber(min, max) {
    return Math.random() * (max - min) + min
}

function gameOver() {
    running = false;
    ball.x = canvasWidth/2;
    ball.y = canvasHeight/2;
    ball.xVelocity = 0;
    ball.yVelocity = 0;
    paddle.x = canvasWidth/2 - paddle.width/2
    paddle.xVelocity = 0;
}

class Ball {
    constructor() {
        this.x = canvasWidth/2;
        this.y = canvasHeight/2;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.radius = 15;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.stroke();
    }

    move() {
        this.x += this.xVelocity;
        this.y += this.yVelocity;
        if (this.x <= (0 + this.radius)) {
            this.xVelocity *= -1;
        }
        if (this.x + this.radius >= canvasWidth) {
            this.xVelocity *= -1;
        }
        if (this.y <= (0 + this.radius)) {
            this.yVelocity *= -1;
        }
        if (this.y + this.radius >= canvasHeight) {
            gameOver();
            this.yVelocity *= -1;
        }
    }
}

class Paddle {
    constructor() {
        this.width = 100;
        this.height = 20;
        this.x = canvasWidth/2 - this.width/2;
        this.y = canvasHeight - this.height;
        this.xVelocity = 0;
    }
    
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.stroke();
    }

    move() {
        if (this.x <= 0  && this.xVelocity == -1 || this.x + this.width >= canvasWidth && this.xVelocity == 1) {
            return;
        }
        this.x += this.xVelocity;
    }
    changeDirection(key) {
        if (key == "ArrowRight") {
            this.xVelocity = 1;
        }
        if (key == "ArrowLeft") {
            this.xVelocity = -1;
        }
    }

    stopMoving(key) {
        if (key == "ArrowRight" && this.xVelocity == 1) {
            this.xVelocity = 0;
        }
        if(key == "ArrowLeft" && this.xVelocity == -1) {
            this.xVelocity = 0;
        }
    }
}

let ball = new Ball();
let paddle = new Paddle();
window.addEventListener('keydown', (event) => {
    console.log(event.key)
    if (event.key == " " && !running) {
        ball.xVelocity = 1;
        ball.yVelocity = 1;
        running = true;
    }
})
window.addEventListener('keydown', (event) => paddle.changeDirection(event.key));
window.addEventListener('keyup', (event) => paddle.stopMoving(event.key))
setInterval(() => {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ball.move();
    ball.draw();
    paddle.move();
    paddle.draw();
    if (ball.y + ball.radius == paddle.y && ball.x >= paddle.x && ball.x <= paddle.x + paddle.width) {
        ball.yVelocity = -1;
        ball.xVelocity = randomNumber((ball.xVelocity - 1 < -2) ? -2 : ball.xVelocity -1, (ball.xVelocity + 1 > 2) ? 2 : ball.xVelocity + 1)
    }
    if (ball.y + ball.radius > paddle.y && ball.x + ball.radius > paddle.x && ball.x < paddle.x + paddle.width/2) {
        ball.yVelocity = -1;
        ball.xVelocity = -1;
    }
    if (ball.y + ball.radius > paddle.y && ball.x > paddle.x + paddle.width/2 && ball.x - ball.radius < paddle.x + paddle.width) {
        ball.yVelocity = -1;
        ball.xVelocity = 1;
    }
}, .01);