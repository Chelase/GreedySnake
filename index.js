const gameContent = document.getElementById('Game-area'); // 获取画布区域id
const ctx = gameContent.getContext('2d'); // 获取canvas实例
const scoreText = document.querySelector('.score');
const resetBtn = document.querySelector('.reset');

const {
    gameBackground,
    snakeColor,
    snakeBorder,
    foodColor,
    gameWidth,
    gameHeight,
    unitSize,
} = {
    // 背景颜色
    gameBackground: "white",
    // 蛇的颜色
    snakeColor: "lightgreen",
    // 蛇的边框颜色
    snakeBorder: "black",
    // 食物颜色
    foodColor: "red",
    // 画布宽度
    gameWidth: gameContent.width,
    // 画布高度
    gameHeight: gameContent.height,
    // 单位大小
    unitSize: 50,
};

let [xVelocaity, yVelocaity] = [unitSize, 0];

// 食物

const food = {
    x: null,
    y: null,
};

let score = 0;
let running = false;

// 蛇

let snake = [
    {
        x: unitSize * 4,
        y: 0,
    },
    {
        x: unitSize * 3,
        y: 0,
    },
    {
        x: unitSize * 2,
        y: 0,
    },
    {
        x: unitSize,
        y: 0,
    },
    {
        x: 0,
        y: 0,
    },
];

window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', resetGame);
document.querySelector('.start').addEventListener('click',gameStart);
drawSnake();

// 开始游戏
function gameStart() {
    running = true;
    scoreText.textContent = score;
    createFood();
    drawFood();
    drawSnake();
    nextTick();
}

// 不断重复移动蛇
function nextTick() {
    if (running) {
        setTimeout(() => {
            clearContent();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    } else
        displayGameOver();
}

// 清除画布
function clearContent() {
    ctx.fillStyle = gameBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
}

// 创建食物的位置，使其随机出现
function createFood() {
    function randomFood(min, max) {
        const randNum =
            Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    food.x = randomFood(0, gameWidth - unitSize);
    food.y = randomFood(0, gameHeight - unitSize);
}

// 使用canvas实例绘制食物
function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x, food.y, 50, 50); // 绘制 x轴 y轴 宽 高
}

// 移动蛇
function moveSnake() {
    const head = {
        x: snake[0].x + xVelocaity,
        y: snake[0].y + yVelocaity,
    };
    snake.unshift(head);
    if (snake[0].x === food.x && snake[0].y === food.y) {
        score++;
        scoreText.textContent = score;
        createFood();
    }
    else
        snake.pop();
}

// 绘制蛇
function drawSnake() {
    ctx.fillStyle = snakeColor; // 绘制填充颜色
    ctx.strokeStyle = snakeBorder; // 绘制描边颜色
    snake.forEach((elem) => {
        ctx.fillRect(elem.x, elem.y, unitSize, unitSize);
        ctx.strokeRect(elem.x, elem.y, unitSize, unitSize);
    })
}

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;

    const goingUp = yVelocaity === -unitSize;
    const goingDown = yVelocaity === unitSize;
    const goingRight = xVelocaity === unitSize;
    const goingLeft = xVelocaity === -unitSize;

    switch (true) {
        case keyPressed === LEFT && !goingRight:
            xVelocaity = -unitSize;
            yVelocaity = 0;
            break;
        case keyPressed === UP && !goingDown:
            xVelocaity = 0;
            yVelocaity = -unitSize;
            break;
        case keyPressed === RIGHT && !goingLeft:
            xVelocaity = unitSize;
            yVelocaity = 0;
            break;
        case keyPressed === DOWN && !goingUp:
            xVelocaity = 0;
            yVelocaity = unitSize;
            break
        case keyPressed === 13:
            gameStart()
            break
    }
}

function checkGameOver() {
    switch (true) {
        case snake[0].x < 0:
            running = false;
            break;
        case snake[0].x >= gameWidth:
            running = false;
            break;
        case snake[0].y < 0:
            running = false;
            break;
        case snake[0].y >= gameHeight:
            running = false;
            break;
    }
    for (let i = 1; i < snake.length; i += 1) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            running = false;
        }
    }
}

// 游戏进行时
function displayGameOver() {
    ctx.font = "50px MV Boli";
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER!', gameWidth / 2, gameHeight / 2);
    running = false;
}

// 重置游戏
function resetGame() {
    score = 0;
    xVelocaity = unitSize;
    yVelocaity = 0;
    snake = [
        { x: unitSize * 4, y: 0 },
        { x: unitSize * 3, y: 0 },
        { x: unitSize * 2, y: 0 },
        { x: unitSize, y: 0 },
        { x: 0, y: 0 },
    ];
    gameStart();
}