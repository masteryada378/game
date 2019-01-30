window.requestAnimationFrame = window.requestAnimationFrame
|| window.webkitRequestAnimationFrame
|| window.mozRequestAnimationFrame
|| function(callback) { window.setTimeout(callback, 1000 / 60)};


var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var looping = true;
var totalSeconds = 0;
var enemySpeed = 100;
var playerSpeed = 200;
var scoreEl = document.getElementById('score');
var lastStrike = Date.now();
var lastTime;
var score = 0;
var img = new Image();
img.src = 'img/my_background_2.png';
var hero = new Image();
//hero.src = 'img/silver.png';
hero.src ="img/playerMoves.png";
var enemy = new Image();
enemy.src = 'img/enemy_moves.png'
var lastFrameTime = 0;
resources = {
    images:{
       // "img/silver.png": hero,
        "img/playerMoves.png": hero,
        'img/enemy_moves.png': enemy
    },
    get(url){
        return this.images[url];
    }
}
 var moves ={
     run: new Sprite('img/playerMoves.png', [20, 220], [127, 180], 17, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16]),
     jump: new Sprite('img/playerMoves.png', [20, 415], [93, 150], 27, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16,17,18,19,20,21,22,23,24,25,26,27]),
     hit: new Sprite('img/playerMoves.png', [12, 575], [164.5, 165], 17, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16])
     //hit: new Sprite('img/playerMoves.png', [0, 25], [192.16, 170], 25, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49])

 } 


// Game state
var player = {
    pos: [100, 800],
    sprite: new Sprite('img/playerMoves.png', [20, 220], [127, 180], 17, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16]),
    action: 'run'
};
var enemyMove = {
    walk: ['img/enemy_moves.png', [15, 12], [153, 156], 25, [0, 1, 2, 3 ,4 ,5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].reverse()],
    hurt: ['img/enemy_moves.png', [0, 0], [153, 156], 25, [0, 1, 2, 3 ,4 ,5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].reverse()],
    death:new Sprite('img/enemy_moves.png', [0, 365], [190, 156], 25, [0, 1, 2, 3 ,4 ,5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35].reverse())
} 
var timeOut = null;
var enemies = [];
var timerNow = null;
var lastFire = Date.now();
var gameTime = 0;
var isGameOver;

// The score
var score = 0;
var scoreEl = document.getElementById('score');

function main() {
    var now = Date.now();
    var dt = (now - lastTime) / 1000.0;
    update(dt);
    render();

    lastTime = now;
    requestAnimationFrame(main);

    
};


function init() {
    // drawBg(0);
    // startStop();
    document.getElementById('play-again').addEventListener('click', function() {
         reset();
    });

    reset();
    lastTime = Date.now();
    main();
}

function startStop() {
    looping = !looping;

    if (looping) {
        lastFrameTime = Date.now();
        requestAnimationFrame(loop);
    }
}
function loop() {
    if (!looping) {
        return;
    }

    requestAnimationFrame(loop);

    var now = Date.now();
    var deltaSeconds = (now - lastFrameTime) / 1000;
    lastFrameTime = now;
    drawBg(deltaSeconds);
}


function drawBg(delta) {
   totalSeconds += delta;
 
    var vx = 100; // the background scrolls with a speed of 100 pixels/sec
    var numImages = Math.ceil(canvas.width / img.width) + 1;
    var xpos = totalSeconds * vx % img.width;
    
    context.save();
    context.translate(-xpos, 0);
    for (var i = 0; i < numImages; i++) {
        context.drawImage(img, i * img.width, 0);
    }
    context.restore();
}

window.onload = function(){
   init();
   canvas.width = window.innerWidth;
}

function update(dt) {
    gameTime += dt;
    player.sprite.update(dt);

    handleInput(dt);
   
    for(var i=0; i<enemies.length; i++) {
        enemies[i].pos[0] -= enemySpeed * dt;
        enemies[i].sprite.update(dt);

        // Remove if offscreen
        if(enemies[i].pos[0] + enemies[i].sprite.size[0] < 0) {
            enemies.splice(i, 1);
            i--;
        }
    }

    // It gets harder over time by adding enemies using this
    // equation: 1-.993^gameTime
    
    
    if(!timerNow) {
        var random = randomInteger(400, 700) * 10;
        
        timerNow = setTimeout(()=>{
            
            enemies.push({
                pos: [canvas.width-20, 810],
                sprite: new Sprite (...enemyMove.walk),
                action: 'walk'
            });
        
            clearTimeout(timerNow);
            timerNow = null;
        },random);
        
       
    }

    checkCollisions();

    scoreEl.innerHTML = score;

};

function handleInput(dt) {
    var heigth = 100;
    function animationDown(){
        timer = setInterval(function(){
            player.pos[1] +=5;
            if(input.isDown('RIGHT') || input.isDown('d'))
            {player.pos[0] +=1;}
            if(player.pos[1] == 800){
                clearInterval(timer);
                player.sprite = moves.run;
                player.action = 'run';
            }
        }, 6)
    }

    if(input.isDown('DOWN') || input.isDown('s')) {
       // player.pos[1] += playerSpeed * dt;
       
    }

    //-jump
    
    if(input.isDown('UP') || input.isDown('w')) {
        console.log(player.pos[1]);
        if(player.pos[1] == 800) {
            player.sprite = moves.jump;
            player.action = 'jump';
            timer = setInterval(function(){
                player.pos[1] -=5;
                if(input.isDown('RIGHT') || input.isDown('d'))
                {player.pos[0] +=1;}
                if(player.pos[1] == 550){
                    clearInterval(timer);
                    animationDown();
                }
            }, 7)
        }
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
      
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
       
    }
    //-hit
    if(input.isDown('SPACE') &&
       !isGameOver &&
       Date.now() - lastStrike> 2000) {
        player.sprite = moves.hit;
        player.action = 'hit';
        setTimeout(function(){
            player.sprite = moves.run;
            player.action = 'run';
        },1000)
        lastStrike = Date.now();
    }
       
    
}
//--status
function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}


function checkPlayer(){
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }
}

function checkCollisions() {
    checkPlayer();
    
    // Run collision detection for all enemies and bullets
    //for(var i=0; i<enemies.length; i++) {
    for(let enemy of enemies){
        var pos = enemy.pos;
        var size = enemy.sprite.size;
 
            var pos2 = [player.pos[0]+50,player.pos[1]];        
            var size2 = [20,50]

            if(boxCollides(pos, size, pos2, size2) && player.action == 'hit'&&!timeOut && enemy.action!='death') {
                // Remove the enemy
                enemy.action = 'death';
                enemy.sprite = enemyMove.death;
                timeOut = setTimeout(() => {
                
                 enemy.sprite = new Sprite('img/enemy_moves.png', [0, 365], [190, 156], 1, [0])
                 score += 100;
                 clearTimeout(timeOut);
                 timeOut = null;
                 }, 800);
                //enemies.splice(i, 1);
               // i--;
                // Add score
                 
                // Add an explosion
                // Remove the bullet and stop this iteration
                break;
            }else if (enemy.action == 'death' && boxCollides(pos, size, pos2, size2)){
                
            }
            else if(player.action != 'hit' && boxCollides(pos, size, pos2, size2)){
                gameOver();
            }

       // if(boxCollides(pos, size, player.pos, player.sprite.size)) {
       //     gameOver();
       // }
    }
}

function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
}
function reset() {
    document.getElementById('game-over').style.display = 'none';
    document.getElementById('game-over-overlay').style.display = 'none';
    isGameOver = false;
    gameTime = 0;
    score = 0;
    enemies = [];
    player.pos = [100, 800];
};
function render() {
    drawBg(0);
    startStop();

    // Render the player if the game isn't over
    if(!isGameOver) {
        renderEntity(player);
    }
    
        renderEntities(enemies);
    
};

function renderEntities(list) {
    for(var i=0; i<list.length; i++) {
        renderEntity(list[i]);
    }    
}

function renderEntity(entity) {
    context.save();
    context.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(context);
    context.restore();
}

function randomInteger(min, max) {
    var rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand);
    return rand;
  }

document.body.onresize = function(e){
    canvas.width = window.innerWidth;
}