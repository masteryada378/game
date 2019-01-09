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
var lastTime;
var img = new Image();
img.src = 'img/my_background_2.png';
var hero = new Image();
hero.src = 'img/hero.png';
var enemy = new Image();
enemy.src = 'img/enemy.png'
var lastFrameTime = 0;
resources = {
    images:{
        "img/hero.png": hero,
        'img/enemy.png': enemy
    },
    get(url){
        return this.images[url];
    }
}


// Game state
var player = {
    pos: [100, 900],
    sprite: new Sprite('img/hero.png', [8, 717], [64, 55], 3, [0, 1, 2, 3 ,4 ,5, 6, 7])
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
console.log(Math.random() < 1 - Math.pow(.993, 20))
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
            console.log(random);
            enemies.push({
                pos: [canvas.width-20, 900],
                sprite: new Sprite('img/enemy.png', [8, 588], [64, 55], 5, 
                                    [0, 1, 2, 3 ,4 ,5, 6, 7, 8])
            });
        
            clearTimeout(timerNow);
            timerNow = null;
        },random);
        
       
    }

    // checkCollisions();

    // scoreEl.innerHTML = score;

};

function handleInput(dt) {
    
    if(input.isDown('DOWN') || input.isDown('s')) {
        player.pos[1] += playerSpeed * dt;
    }

    if(input.isDown('UP') || input.isDown('w')) {
        player.pos[1] -= playerSpeed * dt;
    }

    if(input.isDown('LEFT') || input.isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
    }

    if(input.isDown('RIGHT') || input.isDown('d')) {
        player.pos[0] += playerSpeed * dt;
    }

    // if(input.isDown('SPACE') &&
    //    !isGameOver &&
    //    Date.now() - lastFire > 100) {
    //     var x = player.pos[0] + player.sprite.size[0] / 2;
    //     var y = player.pos[1] + player.sprite.size[1] / 2;

    //     bullets.push({ pos: [x, y],
    //                    dir: 'forward',
    //                    sprite: new Sprite('img/sprites.png', [0, 39], [18, 8]) });
    //     bullets.push({ pos: [x, y],
    //                    dir: 'up',
    //                    sprite: new Sprite('img/sprites.png', [0, 50], [9, 5]) });
    //     bullets.push({ pos: [x, y],
    //                    dir: 'down',
    //                    sprite: new Sprite('img/sprites.png', [0, 60], [9, 5]) });

    //     lastFire = Date.now();
    // }
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
    console.log(window.innerWidth);
    canvas.width = window.innerWidth;
}