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
var timeBlock;
var action;
var img = new Image();
img.src = 'img/my_background_2.png';
var hero = new Image();
//hero.src = 'img/silver.png';
hero.src ="img/player.png";
var enemy = new Image();
enemy.src = 'img/enemy.png'
var lastFrameTime = 0;
resources = {
    images:{
       // "img/silver.png": hero,
        "img/player.png": hero,
        'img/enemy.png': enemy
    },
    get(url){
        return this.images[url];
    }
}
 var moves ={
     run: ['img/player.png', [40, 621], [127, 180], 17, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16]],
     jump: ['img/player.png', [40, 809], [93, 150], 27, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16,17,18,19,20,21,22,23,24,25,26,27]],
     hit: ['img/player.png', [17, 974], [164.5, 165], 17, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16]],
     block: ['img/player.png', [20, 15], [91.2, 165], 18, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16,17]],
     walk: ['img/player.png', [20, 195], [112.4, 180], 25, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16,17,18,19,20,21,22,23,24]],
     walk_LB: ['img/player.png', [20, 195], [112.4, 180], 25, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16,17,18,19,20,21,22,23,24].reverse()]

     //hit: new Sprite('img/player.png', [0, 25], [192.16, 170], 25, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49])

 } 


// Game state
var player = {
    pos: [100, 800],
   // sprite: new Sprite('img/player.png', [30, 220], [127, 180], 17, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16]),
    sprite: new Sprite(...moves.walk),
    action: 'walk'
};
var enemyMove = {
    walk:     ['img/enemy.png', [18, 12], [153, 156], 25, [0, 1, 2, 3 ,4 ,5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].reverse()],
    hurt: [
            ['img/enemy.png', [23.5, 781], [212, 170], 14, [0, 1, 2, 3 ,4 ,5, 6, 7, 8,9,10,11,12,13].reverse()],
            ['img/enemy.png', [40, 984], [240, 170], 21, [0, 1, 2, 3 ,4 ,5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20].reverse()],
            ['img/enemy.png', [40, 1187], [178, 170], 33, [0, 1, 2, 3 ,4 ,5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32].reverse()]
        ],
    happy: new Sprite('img/enemy.png', [23.5, 585], [81, 156], 21, [0, 1, 2, 3 ,4 ,5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20].reverse()),
    death: ['img/enemy.png', [0, 365], [190, 156], 25, [0, 1, 2, 3 ,4 ,5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35].reverse()]
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
                action: 'walk',
                block: false
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
       let timer = setInterval(function(){
            player.pos[1] +=5;
            if(input.isDown('RIGHT') || input.isDown('d'))
            {player.pos[0] +=1;}
            if(player.pos[1] == 800){
                clearInterval(timer);
                player.sprite = new  Sprite(...moves.walk);
                player.action = 'walk';
            }
        }, 6)
    }

    if(input.isDown('DOWN') || input.isDown('s') && player.action !='jump') {
    //     console.log('timeBlock', timeBlock);
    //     if(player.action != 'block'){
    //         action = player.action; 
    //         timeBlock = new Date().getTime();
    //         player.sprite = new Sprite(...moves.block);
    //         player.action = 'block';
    //     }else if(new Date().getTime() >= timeBlock+300) { 
    //         player.sprite.frames = [10];
    //     }
    //   //  let timer = setTimeout(function(){
    //     //        clearTimeout(timer);
    //      //       player.sprite = new  Sprite(...moves.walk);
    //    //         player.action = 'walk';
    //   //  }, 1000)
    // }else if(action && player.action!=action) {
    //     player.action = action;
    //     player.sprite = new Sprite(...moves[action]);
    //     console.log('action', action);
    //     console.log('stopDown');
    }
    

    //-jump
    
    if(input.isDown('UP') || input.isDown('w')) {
        console.log(player.pos[1]);
        if(player.pos[1] == 800) {
            player.sprite = new Sprite(...moves.jump);
            player.action = 'jump';
            let timer = setInterval(function(){
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
        if(player.action != 'walk_LB'){   
            console.log('player.action', player.action) 
                player.sprite = new Sprite(...moves.walk_LB);
                player.action = 'walk_LB';
        }
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
        if(player.action != 'run'){   
        console.log('player.action', player.action);    
            player.sprite = new  Sprite(...moves.run);
            player.action = 'run';
        }
    }
    //-hit
    if(input.isDown('SPACE') &&
       !isGameOver &&
       Date.now() - lastStrike> 2000) {
        player.sprite = new  Sprite(...moves.hit);
        player.action = 'hit';
        setTimeout(function(){
            player.sprite = new  Sprite(...moves.walk);
            player.action = 'walk';
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

function checkRandomPosition(player, enemy){
    let randomPos = randomInteger(4,9) * 10;
    let randomHurt = randomInteger(0,2);
    let pos = player.pos,
        size = player.sprite.size,
        pos2 = enemy.pos;

    if(pos[0]+size[0]+randomPos >= pos2[0] ){
        enemy.block = true;
        enemy.sprite = new Sprite(...enemyMove.hurt[randomHurt]);
        enemy.action = 'hurt';
        setTimeout(() => {
            if(enemy && enemy.action!='death'){
                enemy.block = false;
                enemy.action = 'walk';
                enemy.sprite = new Sprite(...enemyMove.walk);
                console.log(false, player.pos)
            }
        }, 800);
        console.log(randomPos);
    }
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
        var size2 = [20,50];

        if(!enemy.block){
            checkRandomPosition(player, enemy);

        }

        if(boxCollides(pos, size, pos2, size2) && player.action == 'hit'&&!timeOut && enemy.action!='death') {
                // Remove the enemy
                enemy.action = 'death';
                enemy.sprite = new Sprite(...enemyMove.death);
                timeOut = setTimeout(() => {
                
                 enemy.sprite = new Sprite('img/enemy.png', [0, 365], [190, 156], 1, [0])
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
                //--здвиг
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
        
    }else{
        player.pos = [-Infinity,-Infinity];
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