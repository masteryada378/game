window.requestAnimationFrame = window.requestAnimationFrame
|| window.webkitRequestAnimationFrame
|| window.mozRequestAnimationFrame
|| function(callback) { window.setTimeout(callback, 1000 / 60)};


var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var looping = false;
var totalSeconds = 0;
var enemySpeed = 100;
var playerSpeed = 200;
var lastStrike = Date.now();
var lastTime;
var img = new Image();
img.src = 'img/my_background_2.png';
var hero = new Image();
//hero.src = 'img/silver.png';
hero.src ="img/hero_run_jump_atk1.png";
var enemy = new Image();
enemy.src = 'img/enemy_walk.png'
var lastFrameTime = 0;
resources = {
    images:{
       // "img/silver.png": hero,
        "img/hero_run_jump_atk1.png": hero,
        'img/enemy_walk.png': enemy
    },
    get(url){
        return this.images[url];
    }
}
 var moves ={
     run: new Sprite('img/hero_run_jump_atk1.png', [10, 0], [127, 180], 17, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16]),
     jump: new Sprite('img/hero_run_jump_atk1.png', [5, 195], [93, 150], 27, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16,17,18,19,20,21,22,23,24,25,26,27]),
     hit: new Sprite('img/hero_run_jump_atk1.png', [0, 350], [164.5, 165], 17, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16])
 } 


// Game state
var player = {
    pos: [100, 800],
    sprite: new Sprite('img/hero_run_jump_atk1.png', [10, 0], [127, 180], 17, [0, 1, 2, 3 ,4 ,5, 6, 7,8,9,10,11,12,13,14 ,15,16])
    //sprite: new Sprite('img/silver.png', [299, 393], [47.5, 50], 12, [0, 1, 2, 3 ,4 ,5, 6, 7, 8, 9].reverse())
};
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
    // document.getElementById('play-again').addEventListener('click', function() {
    //     // reset();
    // });

    // reset();
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
                pos: [canvas.width-20, 800],
                sprite: new Sprite('img/enemy_walk.png', [0, 0], [153, 156], 25, 
                                    [0, 1, 2, 3 ,4 ,5, 6, 7, 8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24].reverse())
            });
        
            clearTimeout(timerNow);
            timerNow = null;
        },random);
        
       
    }

    // checkCollisions();

    // scoreEl.innerHTML = score;

};

function handleInput(dt) {
    var heigth = 100;
    function animationDown(){
        timer = setInterval(function(){
            player.pos[1] +=2;
            if(player.pos[1] == 800){
                clearInterval(timer);
                player.sprite = moves.run
            }
        }, 2)
    }

    if(input.isDown('DOWN') || input.isDown('s')) {
       // player.pos[1] += playerSpeed * dt;
       
    }

    //-jump
    
    if(input.isDown('UP') || input.isDown('w')) {
        console.log(player.pos[1]);
        if(player.pos[1] == 800) {
            player.sprite = moves.jump;
            console.log(player.pos[1]);
            timer = setInterval(function(){
                player.pos[1] -=2;
                if(player.pos[1] == 570){
                    clearInterval(timer);
                    animationDown();
                }
            }, 2)
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
       Date.now() - lastStrike> 1000) {
        player.sprite = moves.hit;
        setTimeout(function(){
            player.sprite = moves.run;
        },1000)
        lastStrike = Date.now();
    }
       
    
}

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