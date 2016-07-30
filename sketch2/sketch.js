function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(4);
}

function draw() {
  background(0);
  
  fill(Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255));
  ellipse(window.innerWidth/2,window.innerHeight/2,500,500);
}