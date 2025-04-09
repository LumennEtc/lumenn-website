////////////////////////////////////////////////
//////////////// INIT ELEMENTS ////////////////
////////////////////////////////////////////////

//////// Variables
let canvas = document.createElement("canvas");
let context = canvas.getContext('2d');
const maxParticles = 128;
const maxLifetime = 1000;
let width, height, particles = [];

//////// Event listeners
window.addEventListener("DOMContentLoaded", start);

//////// start function 
function start() {
    resizeCanvas();
    canvas.addEventListener("click", start);
    document.body.style.background = 'url(' + canvas.toDataURL() + ')';
    console.log("Initialized");
    animationLoop();
}

//////// Reset width and height variables 
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    width = canvas.width;
    height = canvas.height;
}


////////////////////////////////////////
//////////////// COLOR ////////////////
////////////////////////////////////////

//////// New Color 
function newColor(r, g, b, a=1) {
    let red = r<0?0 : Math.min(r,255);
    let green = g<0?0 : Math.min(g,255);
    let blue = b<0?0 : Math.min(b,255);
    let alpha = a<0?0 : Math.min(a,1);
    let color = {
        r: red,
        g: green,
        b: blue,
        a: alpha
    };
    return color
}

//////// Color as string for style 
function strColor(color) {
    let red = Math.round(color.r<0?0 : Math.min(color.r,255));
    let green = Math.round(color.g<0?0 : Math.min(color.g,255));
    let blue = Math.round(color.b<0?0 : Math.min(color.b,255));
    let alpha = color.a<0?0 : Math.min(color.a,1);
    return `rgba(${red},${green},${blue},${alpha})`    
}


////////////////////////////////////////
//////////////// PARTICLE ////////////////
////////////////////////////////////////

//////// Create new particle
function newParticle (x, y, xvel, yvel, size, color) {
        let p = {
            x: x,
            y: y,
            xvel: xvel,
            yvel: yvel,
            size: size,
            color: color,
            lifeTime : 0,
            glow: 0,
    }
    return p;
}

//////// Draw a particle
function drawOneParticle (p) {
    context.beginPath();
    context.fillStyle = strColor(p.color);
    context.arc(p.x, p.y, p.size, 0, Math.PI*2);
    context.closePath();
    context.fill();
}


////////////////////////////////////////
//////////////// ANIMATION ////////////////
////////////////////////////////////////

//////// Animation loop function : draw balls and request frame
function animationLoop() {
    context.clearRect(0, 0, width, height);
    if(particles.length < maxParticles) {
        let r = Math.random()*64;
        let g = r+192;
        let b = r+96;
        let x = Math.random()*width/2+width/4;
        let y = Math.random()*height/2+height/4;
        let size = Math.random()*12+4;
        let sizeFactor = (4 - Math.sqrt(size))/2;
        let xvel = (x-width/2)*sizeFactor*0.01; //sign * rand * size factor
        let yvel = (y-height/2)*sizeFactor*0.01;
        particles.push(newParticle(x, y, xvel, yvel, size, newColor(r, g, b, 1)));
    }
    else {
        particles.shift();
    }
    drawParticles();
    requestAnimationFrame(animationLoop);
}

//////// Drawballs function
function drawParticles() {
    for(let i=0; i<particles.length; i++){
        p = particles[i];
        drawOneParticle(p);
        if(p.x+p.size > width || p.x-p.size < 0) {
            p.xvel = -p.xvel;
        }
        if(p.y+p.size > height || p.y-p.size < 0) {
            p.yvel = -p.yvel;
        }
        p.lifeTime += 0.01;
        p.x += p.xvel;
        p.y += p.yvel;
        p.xvel *= maxLifetime / (maxLifetime+p.lifeTime^2);
        p.yvel *= maxLifetime / (maxLifetime+p.lifeTime^2);
        p.size *= maxLifetime / (maxLifetime+p.lifeTime);
        p.color.a = 1-p.lifeTime;
    }
}


////////////////////////////////////////////////////////////////
