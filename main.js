const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 512;
canvas.height = 512;

const images = {
    intro_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/intro.png',
    shroom_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/shroom.png',
    house_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/house.png',
    map_img: 'https://raw.githubusercontent.com/Swillycoder/shrooms/main/map.png',
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
    constructor (x,y, image) {
        this.x = x;
        this.y = y;
        this.image = image;
        this.width = 32;
        this.height = 32;
        this.speed = 2
        this.radius = 16;
    }

    boundaries () {
        if (this.x <= 25) this.x = 25;
        if (this.x + this.width >= canvas.width - 25) this.x = canvas.width - this.width - 25;
        if (this.y <= 25) this.y = 25;
        if (this.y + this.height >= canvas.height - 25) this.y = canvas.height - this.height - 25;
    }

    draw () {
        //ctx.fillStyle = this.color;
        //ctx.fillRect = (this.x, this.y, this.width, this.height)
        ctx.drawImage(this.image, this.x, this.y)
    }
    update () {
        if (keys.KeyA) this.x -= this.speed;
        if (keys.KeyD) this.x += this.speed;
        if (keys.KeyW) this.y -= this.speed;
        if (keys.KeyA) this.y += this.speed;
        if (keys.ArrowLeft) this.x -= this.speed;
        if (keys.ArrowRight) this.x += this.speed;
        if (keys.ArrowUp) this.y -= this.speed;
        if (keys.ArrowDown) this.y += this.speed;

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
    constructor(x,y) {
        this.x = x,
        this.y = y,
        this.width = 25;
        this.height = 25;
    }
    draw() {
        ctx.fillStyle = "rgba(0, 0, 0,0)";
        ctx.fillRect(this.x, this.y, this.width, this.height)
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
let doorhouse1;
let doorhouse2;
let doorhouse3;
let doorhouse4;
let doorhouseout;

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
}

function homeScreen1() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(90, 58, 2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0,1)";
    ctx.fillRect(250, 450, 25, 25)
    ctx.font = "30px Impact"
    ctx.fillText("WHAT SHALL WE DO???", 50,100)

    player.update();
    doorhouseout.draw();

    collisionDoor(player, doorhouseout, 'gameScreen', 90, 230);
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

    collisionDoor(player, doorhouseout, 'gameScreen', 90, 460);
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

    player = new Player(canvas.width/2 -25, 400, loadedImages.shroom_img);
    buildings = [
        new Building(45,100, loadedImages.house_img),
        new Building(340,100, loadedImages.house_img),
        new Building(330,300, loadedImages.house_img),
        new Building(50,330, loadedImages.house_img)
    ]
    doorhouse1 = new Doors(90,200)
    doorhouse2 = new Doors(380,200)
    doorhouse3 = new Doors(90,430)
    doorhouse4 = new Doors(370,400)
    doorhouseout = new Doors(250,450)
    
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
});
