const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 512;
canvas.height = 512;

const images = {
    intro_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/intro.png',
    shroom_standl: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/stand_l.png',
    shroom_standr: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/stand_r.png',
    shroom_walkl: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/walk_l.png',
    shroom_walkr: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/walk_r.png',
    house_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/house.png',
    map_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/map.png',

    shroom_walkup: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/shroomback.png',
    house_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/house.png',
    fly_agaric: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/flyagaricanim.png',
    greenshroom_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/greenshroomsprite.png',
    eggshroom_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/eggshroomsprite.png',

};

const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
};

async function loadAllImages(imageSources) {
    const loadedImages = {};
    for (const [key, src] of Object.entries(imageSources)) {
        try {
            loadedImages[key] = await loadImage(src);
            console.log(`${key} loaded successfully`);
        } catch (error) {
            console.error(error);
        }
    }
    return loadedImages;
}

class Player {
    constructor (x,y, width, height, standing_l, standing_r, walking_up, walking_l, walking_r, currentSprite) {
        this.x = x;
        this.y = y;
        //this.image = image;
        this.width = width;
        this.height = height;
        this.speed = 2;
        this.radius = 16;
        this.standing_l = standing_l;
        this.standing_r = standing_r
        this.walking_l = walking_l;
        this.walking_r = walking_r;
        this.walking_up = walking_up;
        this.currentSprite = currentSprite;
        this.frames = 0;
        this.frameDelay = 10;
        this.frameTimer = 0;
    }

    boundaries () {
        if (this.x <= 25) this.x = 25;
        if (this.x + this.width >= canvas.width - 25) this.x = canvas.width - this.width - 25;
        if (this.y <= 25) this.y = 25;
        if (this.y + this.height >= canvas.height - 25) this.y = canvas.height - this.height - 25;
    }

    draw () {
        ctx.drawImage(
            this.currentSprite,
            this.width * this.frames,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
          );
        //ctx.fillStyle = this.color;
        //ctx.fillRect = (this.x, this.y, this.width, this.height)
        //ctx.drawImage(this.image, this.x, this.y)
    }

    obstacles () {
        if (gameState === "gameScreen"){
            for (let building of buildings){

                const rectLeft = building.x - this.radius;
                const rectRight = building.x + building.width - this.radius;
                const rectTop = building.y;
                const rectBottom = building.y + building.height;
            
                // Check for collision and adjust position if necessary
                if (
                    this.x + this.radius > rectLeft && // Right edge of the circle touches left side of square
                    this.x - this.radius < rectRight && // Left edge of the circle touches right side of square
                    this.y + this.radius > rectTop && // Bottom edge of the circle touches top side of square
                    this.y - this.radius < rectBottom // Top edge of the circle touches bottom side of square
                ) {
                    // Repulsion logic
                    if (this.x < rectLeft) {
                        this.x = rectLeft - this.radius; // Push left
                    } else if (this.x > rectRight) {
                        this.x = rectRight + this.radius; // Push right
                    }
            
                    if (this.y < rectTop) {
                        this.y = rectTop - this.radius; // Push up
                    } else if (this.y > rectBottom) {
                        this.y = rectBottom + this.radius; // Push down
                    }
                }
            }
        }
    }

    update () {
        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
          this.frames++;
          this.frameTimer = 0;
        }
    
        if (this.frames >= 4 && this.currentSprite === this.standing_l) {
          this.frames = 0;
        }
        if (this.frames >= 4 && this.currentSprite === this.standing_r) {
            this.frames = 0;
        }
        if (this.frames >= 4 && this.currentSprite === this.walking_l) {
            this.frames = 0;
        }
        if (this.frames >= 4 && this.currentSprite === this.walking_r) {
            this.frames = 0;
        }
        if (this.frames >= 4 && this.currentSprite === this.walking_up) {
            this.frames = 0;
        }



        if (keys.KeyA || keys.ArrowLeft) {
            this.x -= this.speed;
            this.currentSprite = this.walking_l;
        }
        if (keys.KeyD || keys.ArrowRight) {
            this.x += this.speed;
            this.currentSprite = this.walking_r;
        }
        if (keys.KeyS || keys.ArrowDown) {
            this.y += this.speed;
            this.currentSprite = this.walking_r;
        }
        if (keys.KeyW || keys.ArrowUp) {
            this.y -= this.speed;
            this.currentSprite = this.walking_up;
        }
        if ((keys.KeyS || keys.ArrowDown) && (keys.KeyA || keys.ArrowLeft)) {
            this.y += this.speed/4;
            this.currentSprite = this.walking_l;
        }
        if ((keys.KeyS || keys.ArrowDown) && (keys.KeyD || keys.ArrowRight)) {
            this.y += this.speed/4;
            this.currentSprite = this.walking_r;
        }
        
        if ((keys.KeyW || keys.ArrowUp) && (keys.KeyA || keys.ArrowLeft)) {
            this.y -= this.speed/4;
            this.currentSprite = this.walking_l;
        }
        if ((keys.KeyW || keys.ArrowUp) && (keys.KeyD || keys.ArrowRight)) {
            this.y -= this.speed/4;
            this.currentSprite = this.walking_r;
        }

        this.obstacles();
        this.boundaries();
        this.draw();
    }
}

class Building {
    constructor(x,y,image) {
        this.x = x;
        this.y = y;
        this.width = 100;
        this.height = 100;
        this.image = image;
    }

    draw() {
        ctx.drawImage(this.image, this.x, this.y)
    }
}

class Doors {
    constructor(x,y, width, height, alpha) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.alpha = alpha;
    }
    draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fillRect(this.x - this.width/2, this.y, this.width, this.height);
        ctx.fillStyle = `rgba(255,0,0, ${this.alpha})`
        ctx.textAlign = 'center'
        ctx.font = "20px Impact"
        ctx.fillText('EXIT', this.x, this.y+20)
    }
}

class Blocks {
    constructor(jsonPath, x, y) {
        this.hue = 0;
        this.blockSize = 32; // Size of each block
        this.blocks = [];
        this.jsonPath = jsonPath;
        this.x = x;
        this.y = y;
    }

    async loadLevel() {
        try {
            const response = await fetch(this.jsonPath);
            const data = await response.json();
            this.blocks = [];

            for (let row = 0; row < data.blocks.length; row++) {
                for (let col = 0; col < data.blocks[row].length; col++) {
                    if (data.blocks[row][col] === 1) {
                        this.blocks.push({
                            x: col * this.blockSize,
                            y: row * this.blockSize,
                            width: this.blockSize,
                            height: this.blockSize
                        });
                    }
                }
            }

        } catch (error) {
            console.error("Error loading level data:", error);
        }
    }
    drawLevel() {
        this.blocks.forEach(block => {
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            //ctx.fillRect(this.x, this.y, this.blockSize, this.blockSize);
            if (performance.now() % 10 < 1) {  // Update every 10ms
                this.hue = (this.hue + 1.5) % 360;
            }
            ctx.fillRect(block.x, block.y, this.blockSize, this.blockSize);
        });
    }
}

class NPC {
    constructor (x,y, width, height, image) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = image;
        this.frames = 0;
        this.frameDelay = 10;
        this.frameTimer = 0;
    }

    draw () {
        ctx.drawImage(
            this.image,
            this.width * this.frames,
            0,
            this.width,
            this.height,
            this.x,
            this.y,
            this.width,
            this.height
          );
        }
    update () {
        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
          this.frames++;
          this.frameTimer = 0;
        }
    
        if (this.frames >= 4) {
          this.frames = 0;
        }

        this.draw();
    }
}


const keys = {
    KeyA: false,
    KeyD: false,
    KeyW: false,
    KeyS: false,
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
    KeyP: false,
    Space: false,
};

let gameState = "introScreen";
let loadedImages;
let player;
let buildings = [];
let house;
let greenshroom;
let doorhouse1;
let doorhouse2;
let doorhouse3;
let doorhouse4;
let doorhouseout;
let doorhouseout1;
let agaricSprite;
let level1 = new Blocks('level1.json');


function isColliding(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

function collisionDoor(obj1, obj2, stateChange, x, y) {
    if (isColliding(obj1, obj2)) {
        gameState = stateChange
        player.x = x;
        player.y = y
    }
}

function collisionNPC(obj1, obj2, text) {
    if (isColliding(obj1, obj2)) {
        repulsionLogic(obj1,obj2)
        ctx.font = "20px Impact"
        let textWidth = ctx.measureText(text).width;
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillRect(obj2.x - textWidth/2 - 10, obj2.y - 20, textWidth + 20, 25);
        ctx.strokeRect(obj2.x - textWidth/2 - 10, obj2.y - 20, textWidth + 20, 25);
        ctx.textAlign = 'center'
        ctx.fillStyle = 'black'
        ctx.fillText(text, obj2.x, obj2.y)
    }
}

function repulsionLogic(obj1, obj2){
    let overlapX = Math.min(
        obj1.x + obj1.width - obj2.x,  
        obj2.x + obj2.width - obj1.x   
    );

    let overlapY = Math.min(
        obj1.y + obj1.height - obj2.y,  
        obj2.y + obj2.height - obj1.y   
    );

    // Resolve the smallest overlap first to prevent diagonal clipping
    if (overlapX < overlapY) {
        if (obj1.x < obj2.x) {
            obj1.x = Math.max(0, obj1.x - overlapX); // Push left
        } else {
            obj1.x += overlapX; // Push right
        }
    } else {
        if (obj1.y < obj2.y) {
            obj1.y = Math.max(0, obj1.y - overlapY); // Push up
        } else {
            obj1.y += overlapY; // Push down
        }
    }
}

function collisionsBlocks(player, blocks) {
    let collidingBlocks = [];
    for (let block of blocks) {
        if (isColliding(player, block)) {
            collidingBlocks.push(block);
        }
    }
    return collidingBlocks; // Return an array of colliding blocks
}
/*

*/

function gameLoop() {
    if (gameState === "introScreen") {
        introScreen();
    } else if (gameState === "gameScreen") {
        gameScreen();
    } else if (gameState === "homeScreen1") {
        homeScreen1();
    } else if (gameState === "homeScreen2") {
        homeScreen2();
    } else if (gameState === "homeScreen3") {
        homeScreen3();
    } else if (gameState === "homeScreen4") {
        homeScreen4();
    } else if (gameState === "gameOverScreen") {
        gameOverScreen();
    } else if (gameState === "winScreen") {
        winScreen();
    }
    requestAnimationFrame(gameLoop);
}

function introScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(82, 110, 150)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(loadedImages.intro_img,6,6)
}

function gameScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(12, 104, 7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(loadedImages.map_img,0,0)

    player.update();
    greenshroom.update();
    eggshroom.update();
    buildings.forEach((building) => building.draw());
    //house.draw();
    doorhouse1.draw();
    doorhouse2.draw();
    doorhouse3.draw();
    doorhouse4.draw();

    collisionDoor(player, doorhouse1, 'homeScreen1', 250, 400);
    collisionDoor(player, doorhouse2, 'homeScreen2', 250, 400);
    collisionDoor(player, doorhouse3, 'homeScreen3', 250, 400);
    collisionDoor(player, doorhouse4, 'homeScreen4', 250, 400);
    //collisionDoor(player, agaricSprite, 'homeScreen4', 250, 400);

    //animSprite(agaricSprite, 10, loadedImages.fly_agaric, 200, 20, 150, 200, 4)
    agaricSprite.update();

    collisionNPC(player, greenshroom, "HELLO TANGY");
    collisionNPC(player, eggshroom, "ARE YOU NEW HERE?");
    collisionNPC(player, agaricSprite, "HELLO LITTLE ONE");

   
}

let hue = 0;
function homeScreen1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = "rgb(90, 58, 2)";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hue = (hue + 1) % 360; // Keep hue cycling smoothly

    ctx.fillStyle = "rgba(0, 0, 0,1)";
    ctx.fillRect(250, 450, 25, 25)
    ctx.font = "30px Impact"
    ctx.textAlign='center'
    ctx.fillText("TRIPPY ENOUGH FOR YA???", canvas.width/2,420)
    level1.drawLevel(level1.blocks)

    player.update();
    doorhouseout.draw();
    doorhouseout1.draw();

    collisionDoor(player, doorhouseout, 'gameScreen', 90, 230);
    collisionDoor(player, doorhouseout1, 'homeScreen2', canvas.width/2, 30);
    
    let collidingBlocks = collisionsBlocks(player, level1.blocks);
    if (collidingBlocks.length > 0) { 
        for (let block of collidingBlocks) {
            repulsionLogic(player, block); // Resolve each collision separately
        }
    }
}

function homeScreen2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(255, 161, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0,1)";
    ctx.fillRect(250, 450, 25, 25)
    ctx.font = "30px Impact"
    ctx.fillText("WHAT SHALL WE DO???", 50,100)

    player.update();
    doorhouseout.draw();

    collisionDoor(player, doorhouseout, 'gameScreen', 380, 230);
}

function homeScreen3() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(80, 0, 133)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0,1)";
    ctx.fillRect(250, 450, 25, 25)
    ctx.font = "30px Impact"
    ctx.fillText("WHAT SHALL WE DO???", 50,100)

    player.update();
    doorhouseout.draw();

    collisionDoor(player, doorhouseout, 'gameScreen', 90, 430);
}

function homeScreen4() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(173, 1, 18)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0,1)";
    ctx.fillRect(250, 450, 25, 25)
    ctx.font = "30px Impact"
    ctx.fillText("WHAT SHALL WE DO???", 50,100)

    player.update();
    doorhouseout.draw();

    collisionDoor(player, doorhouseout, 'gameScreen', 370, 430);
}

function gameOverScreen () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'orange'
    ctx.fillRect(0,0,canvas.width, canvas.height)

}

function winScreen() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'skyblue'
    ctx.fillRect(0,0,canvas.width, canvas.height)
}

(async () => {
    console.log("Loading images...");
    loadedImages = await loadAllImages(images);
    console.log("All images loaded!");

    player = new Player(canvas.width/2 -25, 400, 32, 32, loadedImages.shroom_standl,
        loadedImages.shroom_standr, loadedImages.shroom_walkup, loadedImages.shroom_walkl, 
        loadedImages.shroom_walkr, loadedImages.shroom_standr);

    greenshroom = new NPC(250,250,32,32, loadedImages.greenshroom_img);
    eggshroom = new NPC(400,230,32,32, loadedImages.eggshroom_img);
    agaricSprite = new NPC(220, 75, 90,120,loadedImages.fly_agaric);

    buildings = [
        new Building(45,100, loadedImages.house_img),
        new Building(340,100, loadedImages.house_img),
        new Building(50,300, loadedImages.house_img),
        new Building(330,300, loadedImages.house_img),
        
    ]
    doorhouse1 = new Doors(90,195, 25, 25, 0)
    doorhouse2 = new Doors(380,195, 25, 25, 0)
    doorhouse3 = new Doors(90,395, 25, 25, 0)
    doorhouse4 = new Doors(370,395, 25, 25, 0)
    doorhouseout = new Doors(canvas.width/2,450, 50, 25, 1)
    doorhouseout1 = new Doors(canvas.width/2,250, 50, 25, 1)

    await level1.loadLevel();
    
    gameLoop();
})();

document.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = true;
    }
    if (gameState === "introScreen") {
        if (e.code === 'Space') {
            gameState = "gameScreen"

        }
    }
    if (gameState === "gameOverScreen" || gameState === "winScreen") {
        if (e.code === 'KeyP') {
            return
        }
    }
});

document.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.code)) {
        keys[e.code] = false;
    }
    if (e.code === "ArrowLeft" || e.code === "KeyA"){
        player.currentSprite = loadedImages.shroom_standl;
    }
    if (e.code === "ArrowRight" || e.code === "KeyD"){
        player.currentSprite = loadedImages.shroom_standr;
    }
    if (e.code === "ArrowUp" || e.code === "ArrowDown" || e.code === "KeyW" || e.code === "KeyS"){
        player.currentSprite = loadedImages.shroom_standr;
    }
});
