const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const GRAVITY = 0.25;
const angleControl = document.getElementById('angleControl');

// generate random terrain
const terrain = new Array(canvas.width);
let h = canvas.height - 50;
for (let x = 0; x < canvas.width; x++) {
    h += (Math.random() - 0.5) * 4;
    h = Math.max(canvas.height / 2, Math.min(canvas.height - 30, h));
    terrain[x] = h;
}

function terrainHeight(x) {
    x = Math.floor(Math.max(0, Math.min(canvas.width - 1, x)));
    return terrain[x];
}


class Tank {
    constructor(x, color) {
        this.x = x;
        this.y = terrainHeight(x) - 20;
        this.angle = Math.PI / 4;
        this.power = 15;
        this.color = color;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = this.color;
        ctx.fillRect(-15, -10, 30, 10); // body
        ctx.fillRect(-20, -20, 40, 10); // base
        ctx.rotate(-this.angle);
        ctx.fillRect(0, -4, 20, 4); // barrel
        ctx.restore();
    }
}

class Projectile {
    constructor(x, y, angle, power, color) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * power;
        this.vy = -Math.sin(angle) * power;
        this.color = color;
        this.active = true;
    }

    update() {
        if (!this.active) return;
        this.vy += GRAVITY;
        this.x += this.vx;
        this.y += this.vy;
        if (this.y > terrainHeight(this.x)) {
            this.active = false;
        }
    }

    draw() {
        if (!this.active) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

const tank1 = new Tank(100, '#ff6161');
const tank2 = new Tank(canvas.width - 100, '#61ff61');
let currentTank = tank1;
let projectile = null;

function drawBackground() {
    ctx.beginPath();
    ctx.moveTo(0, canvas.height);
    for (let x = 0; x < canvas.width; x++) {
        ctx.lineTo(x, terrain[x]);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.closePath();
    ctx.fillStyle = '#654321';
    ctx.fill();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    tank1.y = terrainHeight(tank1.x) - 20;
    tank2.y = terrainHeight(tank2.x) - 20;
    tank1.draw();
    tank2.draw();
    if (projectile) {
        projectile.draw();
    }
}

function update() {
    if (projectile) {
        projectile.update();
        if (!projectile.active) {
            projectile = null;
            currentTank = currentTank === tank1 ? tank2 : tank1;
            angleControl.value = (currentTank.angle * 180 / Math.PI).toFixed(0);
        }
    }
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    update();
    draw();
}

window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowLeft':
            currentTank.x -= 5;
            break;
        case 'ArrowRight':
            currentTank.x += 5;
            break;
        case 'ArrowUp':
            currentTank.angle = Math.min(currentTank.angle + 0.05, Math.PI / 2);
            angleControl.value = (currentTank.angle * 180 / Math.PI).toFixed(0);
            break;
        case 'ArrowDown':
            currentTank.angle = Math.max(currentTank.angle - 0.05, 0);
            angleControl.value = (currentTank.angle * 180 / Math.PI).toFixed(0);
            break;
        case '+':
        case '=':
            currentTank.power = Math.min(currentTank.power + 1, 20);
            break;
        case '-':
            currentTank.power = Math.max(currentTank.power - 1, 5);
            break;
        case ' ':
            if (!projectile) {
                projectile = new Projectile(currentTank.x, currentTank.y - 20, currentTank.angle, currentTank.power, currentTank.color);
            }
            break;
    }
});

angleControl.addEventListener('input', () => {
    currentTank.angle = angleControl.value * Math.PI / 180;
});


gameLoop();
