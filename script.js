let gameboard = document.getElementById("game-board");
let score = document.getElementById("score");
let reset_button = document.getElementById("reset-button");
let pause_button = document.getElementById("pause");
const collisonSound = new Audio("Sounds/collision_sound.wav");
const missedSound = new Audio("Sounds/retro_error_sound.ogg");
let tempXlocation;
let tempYlocation;
let paused = false;

let intervalId;
let ctx = gameboard.getContext("2d");
let ballX = gameboard.width/2;
let ballY = gameboard.height/2;
let ball_radius = 13;
let ballXDirection = 1;
let ballYDirection = 1;
const board_width = gameboard.width;
const board_height = gameboard.height;
let board_bg = "rgb(25, 25, 25)";


let keys = {}; // Tracks which keys are pressed
const paddleSpeed = 5; // Adjust speed as needed

// Event listeners for key press and release
const keyPress = (event) => {
    keys[event.keyCode] = true;
}

const keyLeft = (event) => {
    keys[event.keyCode] = false;
}
window.addEventListener("keydown", keyPress);

window.addEventListener("keyup", keyLeft);




let player_left_score = 0;
let player_right_score = 0;


let paddle_left = {
    width : 25,
    height : 100,
    x : 0,
    y : 0
}
let paddle_right = {
    width : 25,
    height : 100,
    x : board_width - 25,
    y : board_height - 100
}

const pauseGame = (event) => {
    tempXlocation = ballXDirection;
    tempYlocation = ballYDirection;

    ballXDirection = 0;
    ballYDirection = 0;

    window.removeEventListener("keydown", keyPress);
}
const resumeGame = (event) =>{
    ballXDirection = tempXlocation;
    ballYDirection = tempYlocation;
    window.addEventListener("keydown", keyPress);
}


const gameStart = () => {
    createBall();
    nextTick();
}


const nextTick = () => {
    intervalId = setTimeout(() => {
        clearBoard();
        handleDirections();
        drawPaddles();
        moveBall();
        drawBall();
        checkCollisions();
        nextTick();

    }, 10);
}


const createBall = () => {
    ballSpeed = 1;
    ballX = board_width / 2;
    ballY = board_height / 2;
    if(Math.round(Math.random()) == 1){
        ballXDirection = 1;
    }
    else{
        ballXDirection = -1;
    }
    
    if(Math.round(Math.random()) == 1){
        ballYDirection = Math.random() * 1;
    }
    else{
        ballYDirection = Math.random() * -1;
    }
    drawBall();

}


const moveBall = () => {
    ballX += ballXDirection * ballSpeed;
    ballY += ballYDirection * ballSpeed;
}


const drawPaddles = () => {
    // for Left Paddle
    ctx.fillStyle = "rgb(233, 57, 86)";
    ctx.strokeStyle = "rgb(233, 57, 86)"; 
    ctx.lineWidth = 7;  
    ctx.lineCap = "round";   
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.fillRect(paddle_left.x, paddle_left.y, paddle_left.width, paddle_left.height);
    ctx.strokeRect(paddle_left.x, paddle_left.y, paddle_left.width, paddle_left.height);
    

    // for Right Paddle
    ctx.strokeStyle = "rgb(233, 57, 86)";
    ctx.fillStyle = "rgb(233, 57, 86)";
    ctx.lineWidth = 7;
    ctx.lineCap = "round";   
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.fillRect(paddle_right.x, paddle_right.y, paddle_right.width, paddle_right.height);
    ctx.strokeRect(paddle_right.x, paddle_right.y, paddle_right.width, paddle_right.height);

}


const drawBall = () => {
    ctx.fillStyle = "rgb(233, 57, 86)";
    ctx.beginPath();
    ctx.arc(ballX, ballY, ball_radius, 0, 2 * Math.PI);
    ctx.fill();
}


const clearBoard = () => {
    ctx.fillStyle = board_bg;
    ctx.fillRect(0, 0, board_width, board_height);
}


const updateScore = () => {
    score.textContent = `${player_left_score} : ${player_right_score}`;
}


const checkCollisions = () => {
    // Right player doesnt deflect the ball
    if(ballX > board_width){
        missedSound.play();
        player_left_score++;
        updateScore();
        createBall();
        return;
    }
    // Left player doesnt deflect the ball
    if(ballX < 0){
        missedSound.play();
        player_right_score++;
        updateScore();
        createBall();
        return;
    }

    //if ball touches the top
    if(ballY <= 0){
        ballYDirection *= -1;
        collisonSound.play();
    }
    //if ball touches the bottom
    if(ballY >= board_height){
        ballYDirection *= -1;
        collisonSound.play();
    }


    if(ballX <= (paddle_left.x + ball_radius + paddle_left.width)){
        if(ballY >= paddle_left.y && ballY <= paddle_left.height + paddle_left.y){
            collisonSound.play();
            ballX = paddle_left.x + paddle_left.width + ball_radius;
            ballXDirection *= -1;
            ballSpeed += 0.3;
            return;
        }
    }
    if(ballX >= paddle_right.x - ball_radius ){
        if(ballY >= paddle_right.y && ballY <= paddle_right.height + paddle_right.y){
            collisonSound.play();
            ballX = paddle_right.x - ball_radius;
            ballXDirection *= -1;
            ballSpeed += 0.3;
            return;
        }
    }

}


const handleDirections = () => {

    const w_key = 87;

    const s_key = 83;

    const up_key = 38;

    const down_key = 40;
    
    if(keys[w_key] && paddle_left.y > 0){
        paddle_left.y -= paddleSpeed;
    }
    if(keys[s_key] && paddle_left.y < board_height - paddle_left.height ){
        paddle_left.y += paddleSpeed;
    }
    if(keys[up_key] && paddle_right.y > 0){
        paddle_right.y -= paddleSpeed;
    }
    if(keys[down_key] && paddle_right.y <  board_height - paddle_right.height){
        paddle_right.y += paddleSpeed;
    }

} 

const reset = () =>{
    ballSpeed = 1;
    player_left_score = 0;
    player_right_score = 0;
    ballX = 0;
    ballY = 0;
    ballXDirection = 0;
    ballYDirection = 0;
    paddle_left.x = 0;
    paddle_left.y = 0;
    paddle_right.x = board_width - 25;
    paddle_right.y = board_height - 100;
    if(paused){
        window.addEventListener("keydown", keyPress);
    }
    paused = false;
    clearInterval(intervalId);
    updateScore();
    gameStart();

}


updateScore();
gameStart();
reset_button.addEventListener("click", reset);
pause_button.addEventListener("click", () => {
    if(paused){
        resumeGame();
        paused = false;
    }
    else{
        pauseGame();
        paused = true;
    }
});

