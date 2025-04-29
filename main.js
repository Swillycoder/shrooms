import { NPCDialogueAgaric1, NPCDialogueGreen1, NPCDialogueEgg1 } from "./npc.js";
import { introScreen } from "./states.js";

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
    shroom_walkup: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/shroomback.png',
    house_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/house.png',
    fly_agaric: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/flyagaricanim.png',
    greenshroom_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/greenshroomsprite2.png',
    eggshroom_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/eggshroomsprite2.png',
    map_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/map.png',
    pineconeRed_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/pineconered.png',
    pineconeBlue_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/pineconeblue.png',
    pineconeGreen_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/pineconegreen.png',
    snowflake_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/snowflake.png',
    snowflakeanim_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/snowflakeanim.png',
    ice_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/ice.png',
    flame_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/flame.png',
    flameanim_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/flameanim.png',
    log_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/log.png',
    lifemeter_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/lifebar.png',
    door_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/door1.png',
    rock_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/rock.png',
    winScreen_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/winscreen.png',
    altar_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/altar.png',
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
        this.hp = 10;
    }

    boundaries () {
        if (this.x <= 25) this.x = 25;
        if (this.x + this.width >= canvas.width - 25) this.x = canvas.width - this.width - 25;
        if (this.y <= 25) this.y = 25;
        if (this.y + this.height >= canvas.height - 25) this.y = canvas.height - this.height - 25;
    }

    life () {
        ctx.fillStyle = 'black';
        ctx.fillRect(32,0,103,28);
        ctx.fillStyle = 'red'
        ctx.fillRect(35, 3, this.hp * 10, 25);
        ctx.drawImage(loadedImages.lifemeter_img,32,0);
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
        this.life();
        this.draw();
    }
}

class Inventory {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.width = 400;
        this.height = 400
        this.items = [];
    }
}

class Items{
    constructor(x,y,image, name, type, gameState) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.image = image;
        this.name = name;
        this.type = type;
        this.gameState = gameState;
    }

    draw(currentGameState) {
        if (this.gameState === currentGameState)
            ctx.drawImage(this.image, this.x, this.y)
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
    }

    draw2 () {
        ctx.drawImage(loadedImages.door_img, this.x,this.y);
    }
}

class Blocks {
    constructor(jsonPath, x, y) {
        this.hue = 0;
        this.blockSize = 32; // Size of each block
        this.blocks = [];
        this.blocks2 = [];
        this.jsonPath = jsonPath;
        this.x = x;
        this.y = y;
        this.red = 255;
        this.green = 255;
        this.blue = 255;
        this.fadeDirection = -1
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

    drawLevel1() {
        this.blocks.forEach(block => {
            if (this.blue <= 0 || this.blue >= 255) {
                this.fadeDirection *= -1; // Reverse direction
            }
            
            this.blue += 0.01 * this.fadeDirection;
            this.green += 0.01 * this.fadeDirection;
            
            // Clamp values to avoid going outside 0–255
            this.blue = Math.max(0, Math.min(255, this.blue));
            this.green = Math.max(0, Math.min(255, this.green));
            
            ctx.fillStyle = `rgb(255, ${this.green}, ${this.blue})`;
            ctx.strokeStyle = 'black';
            ctx.fillRect(block.x, block.y, this.blockSize, this.blockSize);
            ctx.strokeRect(block.x, block.y, this.blockSize, this.blockSize);
            ctx.drawImage(loadedImages.flame_img, block.x, block.y)
        });
    }

    drawLevel2() {
        this.blocks.forEach(block => {
            if (this.red <= 0 || this.red >= 255) {
                this.fadeDirection *= -1; // Reverse direction
            }
            
            this.red += 0.01 * this.fadeDirection;
            this.green += 0.01 * this.fadeDirection;
            
            // Clamp values to avoid going outside 0–255
            this.red = Math.max(0, Math.min(255, this.red));
            this.green = Math.max(0, Math.min(255, this.green));
            
            ctx.fillStyle = `rgb(${this.red}, ${this.green}, 255)`;
            ctx.strokeStyle = 'black';
            ctx.fillRect(block.x, block.y, this.blockSize, this.blockSize);
            ctx.strokeRect(block.x, block.y, this.blockSize, this.blockSize);
            ctx.drawImage(loadedImages.snowflake_img, block.x, block.y)
        });
    }

    drawLevel3() {
        this.blocks.forEach(block => {
            if (this.red <= 0 || this.red >= 255) {
                this.fadeDirection *= -1; // Reverse direction
            }
            
            this.blue += 0.01 * this.fadeDirection;
            this.red += 0.01 * this.fadeDirection;
            
            // Clamp values to avoid going outside 0–255
            this.red = Math.max(0, Math.min(255, this.red));
            this.blue = Math.max(0, Math.min(255, this.blue));
            
            ctx.fillStyle = `rgb(${this.red}, 255, ${this.blue})`;
            ctx.strokeStyle = 'black';
            ctx.fillRect(block.x, block.y, this.blockSize, this.blockSize);
            ctx.strokeRect(block.x, block.y, this.blockSize, this.blockSize);
            ctx.drawImage(loadedImages.log_img, block.x, block.y)
        });
    }
    drawLevel4() {
        this.blocks.forEach(block => {
            ctx.fillStyle = `hsl(${this.hue}, 100%, 50%)`;
            ctx.strokeStyle = 'black'
            if (performance.now() % 10 < 1) {  // Update every 10ms
                this.hue = (this.hue + 1.5) % 360;
            }
            ctx.fillRect(block.x, block.y, this.blockSize, this.blockSize);
            ctx.strokeRect(block.x, block.y, this.blockSize, this.blockSize);
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

class Obstacle {
    constructor (x,y, color, speedX, speedY, distance, sprite) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.width = 32;
        this.height = 32;
        this.speedX = speedX;
        this.speedY = speedY;
        this.distance = distance;
        this.startX = x;
        this.startY = y;
        this.frames = 0;
        this.frameDelay = 10;
        this.frameTimer = 0;
        this.sprite = sprite
    }
    draw () {
        ctx.drawImage(
            this.sprite,
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

        this.x += this.speedX;
        this.y += this.speedY;

        const dx = this.x - this.startX;
        const dy = this.y - this.startY;

        if (Math.abs(dx) >= this.distance || Math.abs(dy) >= this.distance) {
            this.x = this.startX;
            this.y = this.startY;
        }
        this.draw()
    }
}

class Scenery {
    constructor(x,y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = this.image.width;
        this.height = this.image.height;

    }
    draw() {
        ctx.drawImage(this.image, this.x, this.y)
    }
}

const keys = {
    KeyA: false,
    KeyD: false,
    KeyW: false,
    KeyS: false,
    KeyI: false,
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
let items = [];
let pinecones = [];
let eggshroom;
let greenshroom;
let doorhouse1;
let doorhouse2;
let doorhouse3;
let doorhouse4;
let doorhouseout;
let doorhouseout2;
let agaricSprite;
let level1 = new Blocks('level1.json');
let level2 = new Blocks('level2.json');
let level3 = new Blocks('level3.json');
let level4 = new Blocks('level4.json');

let fireObstacles = [];
let obstacleFire1;
let obstacleFire2;
let obstacleFire3;
let obstacleFire4;
let obstacleFire5;

let iceObstacles = [];
let obstacleIce1;
let obstacleIce2;
let obstacleIce3;
let obstacleIce4;
let obstacleIce5;

let earthObstacles = [];
let obstacleEarth1;
let obstacleEarth2;
let obstacleEarth3;
let obstacleEarth4;
let obstacleEarth5;

let altars = [];
let altarFire;
let altarIce;
let altarEarth;


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

function collisionObstacle(obj1, obj2) {
    if (gameState === "homeScreen1")
        if (isColliding(obj1, obj2)) {
            player.hp -= 1;
            obj2.x =-32;
            obj2.y =-32;
        const index = fireObstacles.indexOf(obj2);
        
        if (index !== -1) {
            fireObstacles.splice(index, 1);
        }
    }

    if (gameState === "homeScreen2")
        if (isColliding(obj1, obj2)) {
            player.hp -= 1;
            obj2.x =-32;
            obj2.y =-32;
        const index2 = iceObstacles.indexOf(obj2);
        if (index2 !== -1) {
            iceObstacles.splice(index2, 1);
        }
    }

    if (gameState === "homeScreen3")
        if (isColliding(obj1, obj2)) {
            player.hp -= 1;
            obj2.x =-32;
            obj2.y =-32;
        const index3 = earthObstacles.indexOf(obj2);
        if (index3 !== -1) {
            earthObstacles.splice(index3, 1);
        }
    }
}

function collisionItem(player, item) {
    if (isColliding(player, item)) {
        console.log("Collision with:", item.name);
        if(item.type === "pinecone") {
            pinecones.push(item);
        }
        removeItem(item);
    }
}

function removeItem(item) {
    const index = items.indexOf(item);
    if (index > -1) {
        items.splice(index, 1)
    }
}

function checkItemCollisions(itemName) {
    const item = items.find(item => item.name === itemName && isColliding(player, item));

    if (item) {
        collisionItem(player, item);
    }
}

function drawItems(itemName) {
    const item = items.find(item => item.name === itemName);
    if (item) {
        item.draw();
    }
}

function collisionNPC(obj1, obj2) {
    if (isColliding(obj1, obj2)) {
        repulsionLogic(obj1,obj2);
        return true;
    }
    return false;
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

function collisionScenery(obj1, obj2) {
    if (isColliding(obj1, obj2)) {
        repulsionLogic(obj1,obj2);
        return true;
    }
    return false;
}

function gameLoop() {
    if (gameState === "introScreen") {
        introScreen(ctx, loadedImages.intro_img);
    } else if (gameState === "inventory") {
        inventory();
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

    } else if (gameState === "NPCDialogueAgaric1") {
        NPCDialogueAgaric1(ctx);

    } else if (gameState === "NPCDialogueGreen1") {
        NPCDialogueGreen1(ctx);

    } else if (gameState === "NPCDialogueEgg1") {
        NPCDialogueEgg1(ctx);

    } else if (gameState === "gameOverScreen") {
        gameOverScreen();
    } else if (gameState === "winScreen") {
        winScreen();
    }
    requestAnimationFrame(gameLoop);
}

function inventory() {
    return
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

    doorhouse1.draw();
    doorhouse2.draw();
    doorhouse3.draw();
    doorhouse4.draw();

    collisionDoor(player, doorhouse1, 'homeScreen1', 222, 400);
    collisionDoor(player, doorhouse2, 'homeScreen2', 222, 400);
    collisionDoor(player, doorhouse3, 'homeScreen3', 222, 400);
    collisionDoor(player, doorhouse4, 'homeScreen4', 222, 400);

    agaricSprite.update();

    if (collisionNPC(player, greenshroom))
        gameState = "NPCDialogueGreen1";

    if (collisionNPC(player, eggshroom))
        gameState = "NPCDialogueEgg1";;

    if (pinecones.length < 3 && collisionNPC(player, agaricSprite))
        gameState = "NPCDialogueAgaric1"

    if (pinecones.length === 3 && collisionNPC(player, agaricSprite)) {
        gameState = 'winScreen'
    }

}


function homeScreen1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(222, 21, 21)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 440, 512, 48);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 488, 512, 48);
    ctx.fillStyle = 'pink';
    
    fireObstacles.forEach(obstacle => {
        obstacle.update();
    });

    level1.drawLevel1(level1.blocks)

    player.update();
    doorhouseout.draw2();

    drawItems("pineconeRed");
    checkItemCollisions("pineconeRed");

    collisionDoor(player, doorhouseout, 'gameScreen', 90, 230);

    collisionObstacle(player, obstacleFire1);
    collisionObstacle(player, obstacleFire2);
    collisionObstacle(player, obstacleFire3);
    collisionObstacle(player, obstacleFire4);
    collisionObstacle(player, obstacleFire5);
    
    let collidingBlocks = collisionsBlocks(player, level1.blocks);
    if (collidingBlocks.length > 0) { 
        for (let block of collidingBlocks) {
            repulsionLogic(player, block);
        }
    }
}

function homeScreen2() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(loadedImages.ice_img, 0,0)
    ctx.fillStyle = "rgb(22, 49, 75)";
    ctx.fillRect(250, 450, 25, 25);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 440, 512, 48);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 488, 512, 48);

    iceObstacles.forEach(obstacle => {
        obstacle.update();
    });

    level2.drawLevel2(level2.blocks)

    player.update();
    doorhouseout.draw2();
    drawItems("pineconeBlue");
    checkItemCollisions("pineconeBlue");

    collisionDoor(player, doorhouseout, 'gameScreen', 380, 230);

    collisionObstacle(player, obstacleIce1);
    collisionObstacle(player, obstacleIce2);
    collisionObstacle(player, obstacleIce3);
    collisionObstacle(player, obstacleIce4);
    collisionObstacle(player, obstacleIce5);

    let collidingBlocks = collisionsBlocks(player, level2.blocks);
    if (collidingBlocks.length > 0) { 
        for (let block of collidingBlocks) {
            repulsionLogic(player, block); // Resolve each collision separately
        }
    }
}

function homeScreen3() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "limegreen";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(9, 131, 0)";
    ctx.fillRect(250, 450, 25, 25);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 440, 512, 48);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 488, 512, 48);

    earthObstacles.forEach(obstacle => {
        obstacle.update();
    });

    level3.drawLevel3(level3.blocks)

    player.update();
    doorhouseout.draw2();
    drawItems("pineconeGreen");
    checkItemCollisions("pineconeGreen");

    collisionDoor(player, doorhouseout, 'gameScreen', 80, 420);

    collisionObstacle(player, obstacleEarth1);
    collisionObstacle(player, obstacleEarth2);
    collisionObstacle(player, obstacleEarth3);
    collisionObstacle(player, obstacleEarth4);
    collisionObstacle(player, obstacleEarth5);

    let collidingBlocks = collisionsBlocks(player, level3.blocks);
    if (collidingBlocks.length > 0) { 
        for (let block of collidingBlocks) {
            repulsionLogic(player, block); // Resolve each collision separately
        }
    }
}

let hue = 0;
let pineconeRedPlaced = false;
let pineconeBluePlaced = false;
let pineconeGreenPlaced = false;

function homeScreen4() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    hue = (hue + 1) % 360; // Keep hue cycling smoothly
    ctx.fillStyle = "rgba(0, 0, 0,1)";
    ctx.fillRect(250, 450, 25, 25)
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 440, 512, 48);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 488, 512, 48);

    altars.forEach(altar => {
        altar.draw();
    });

    level4.drawLevel4(level4.blocks)

    player.update();
    doorhouseout2.draw2();
    collisionDoor(player, doorhouseout, 'gameScreen', 350, 420);

    if (gameState === "homeScreen4" && collisionScenery(player, altarFire)){
        if (pinecones.length >= 3 && player.y <= 250){
            pineconeRedPlaced = true;
        }
    }
        if (pineconeRedPlaced === true) {
            const redPinecone = pinecones.find(item => item.name === "pineconeRed");
            if (redPinecone) {
                redPinecone.x = 140;
                redPinecone.y = 180;
                redPinecone.draw();
            }
        }

    if (gameState === "homeScreen4" && collisionScenery(player, altarIce)) {
        if (pinecones.length >= 3){
                pineconeBluePlaced = true;
        }
    }
        if (pineconeBluePlaced) {
            const bluePinecone = pinecones.find(item => item.name === "pineconeBlue");
            if (bluePinecone) {
                bluePinecone.x = canvas.width/2 - 16;
                bluePinecone.y = 180;
                bluePinecone.draw();
            }
        }

    if (gameState === "homeScreen4" && collisionScenery(player, altarEarth)) {
        if (pinecones.length >= 3){
                pineconeGreenPlaced = true;
        }
    }
        if (pineconeGreenPlaced && gameState === "homeScreen4") {
            const greenPinecone = pinecones.find(item => item.name === "pineconeGreen");
            if (greenPinecone) {
                greenPinecone.x = 345;
                greenPinecone.y = 180;
                greenPinecone.draw();
            }
        }
    }

    let collidingBlocks = collisionsBlocks(player, level4.blocks);
    if (collidingBlocks.length > 0) { 
        for (let block of collidingBlocks) {
            repulsionLogic(player, block); // Resolve each collision separately
    }
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
    ctx.drawImage(loadedImages.winScreen_img,0,0)
    ctx.fillStyle = 'black'
    ctx.textAlign = 'center'
    ctx.font = '25px "Freckle Face"';
    ctx.fillText("THANK YOU!!!", 385, 55)
    
    ctx.font = '15px "Freckle Face"';
    ctx.fillText("YOU FOUND MY PINECONES", 385, 70)
    ctx.fillText("PLACE THEM ON THE ALTARS", 385, 85)
    ctx.fillText("HIT ENTER", 385, 100)
    ctx.fillText("TO CONTINUE YOUR QUEST", 385, 115)
}

(async () => {
    console.log("Loading images...");
    loadedImages = await loadAllImages(images);
    console.log("All images loaded!");

    player = new Player(canvas.width/2 -18, 400, 32, 32, loadedImages.shroom_standl,
        loadedImages.shroom_standr, loadedImages.shroom_walkup, loadedImages.shroom_walkl, 
        loadedImages.shroom_walkr, loadedImages.shroom_standr);
    //NPCs
    greenshroom = new NPC(230,270,40,40, loadedImages.greenshroom_img);
    eggshroom = new NPC(420,250,40,40, loadedImages.eggshroom_img);
    agaricSprite = new NPC(220, 75, 90,120,loadedImages.fly_agaric);

    buildings = [
        new Building(45,100, loadedImages.house_img),
        new Building(340,100, loadedImages.house_img),
        new Building(50,300, loadedImages.house_img),
        new Building(330,300, loadedImages.house_img),
    ]
    //Doors
    doorhouse1 = new Doors(90,195, 25, 25, 0)
    doorhouse2 = new Doors(380,195, 25, 25, 0)
    doorhouse3 = new Doors(90,395, 25, 25, 0)
    doorhouse4 = new Doors(370,395, 25, 25, 0)
    doorhouseout = new Doors(canvas.width/2 - 55,440, 50, 25, 0)
    doorhouseout2 = new Doors(canvas.width/2 - 39,440, 50, 25, 0)
    //Items
    items = [
        new Items(12*32, 8*32, loadedImages.pineconeRed_img, "pineconeRed", "pinecone"),
        new Items(9*32, 10*32, loadedImages.pineconeBlue_img, "pineconeBlue", "pinecone"),
        new Items(14*32, 32, loadedImages.pineconeGreen_img, "pineconeGreen", "pinecone"),
    ]

    await level1.loadLevel();
    await level2.loadLevel();
    await level3.loadLevel();
    await level4.loadLevel();

    fireObstacles = [
        obstacleFire1 = new Obstacle(0,32,'red', 1.5, 0, 15*32, loadedImages.flameanim_img),
        obstacleFire2 = new Obstacle(0,7*32,'red', 1.5, 0, 5*32, loadedImages.flameanim_img),
        obstacleFire3 = new Obstacle(8*32,5*32,'red', 0, 1, 4*32, loadedImages.flameanim_img),
        obstacleFire4 = new Obstacle(11*32,5*32,'red', 0, 1, 4*32, loadedImages.flameanim_img),
        obstacleFire5 = new Obstacle(0,4*32,'red', 1, 0, 16*32, loadedImages.flameanim_img),
    ]

    iceObstacles = [
        obstacleIce1 = new Obstacle(32,0,'red', 0, 1.5, 11*32, loadedImages.snowflakeanim_img),
        obstacleIce2 = new Obstacle(4*32,0,'red', 0, 1.5, 8*32, loadedImages.snowflakeanim_img),
        obstacleIce3 = new Obstacle(14*32,0,'red', 0, 1.5, 11*32, loadedImages.snowflakeanim_img),
        obstacleIce4 = new Obstacle(0,4*32,'red', 1, 0, 15 * 32, loadedImages.snowflakeanim_img),
        obstacleIce5 = new Obstacle(0,7*32,'red', 1, 0, 15 * 32, loadedImages.snowflakeanim_img),
    ]

    earthObstacles = [
        obstacleEarth1 = new Obstacle(32,0, 'red', 0,1.5,11*32,loadedImages.rock_img),
        obstacleEarth2 = new Obstacle(4*32,0, 'red', 0,1,9*32,loadedImages.rock_img),
        obstacleEarth3 = new Obstacle(6*32,0, 'red', 0,1,9*32,loadedImages.rock_img),
        obstacleEarth4 = new Obstacle(11*32,0, 'red', 0,1.5,11*32,loadedImages.rock_img),
        obstacleEarth5 = new Obstacle(13*32,0, 'red', 0,1.5,11*32,loadedImages.rock_img),
    ]

    altars = [
        altarFire = new Scenery(canvas.width/2 - 125, 200, loadedImages.altar_img),
        altarIce = new Scenery(canvas.width/2 - 25, 200, loadedImages.altar_img),
        altarEarth = new Scenery(canvas.width/2 + 75, 200, loadedImages.altar_img),
    ]
    
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
    if (gameState === "NPCDialogueAgaric1" || gameState === "NPCDialogueGreen1" || gameState === "NPCDialogueEgg1") {
        if (e.code === 'Enter') {
            gameState = "gameScreen"
        }
    }

    if (gameState === "gameOverScreen" || gameState === "winScreen") {
        if (e.code === 'KeyP') {
            return
        }
    }
    if (gameState === "winScreen") {
        if (e.code === 'Enter') {
                gameState = "gameScreen"
            }
    }
    

    if (gameState === "gameScreen" || gameState === "homeScreen1" || gameState === "homeScreen2"
        || gameState === "homeScreen3" || gameState === "homeScreen4") {
        if (e.code === 'KeyI') {
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
