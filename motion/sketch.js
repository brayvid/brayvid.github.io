// Uses:
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

var mover;

function setup() {
  
  // takes care of resizing
  createCanvas(windowWidth, windowHeight);
  frameRate(33);
  
  mover = new Mover();
}

function draw() {
  background(0);

  mover.update();
  mover.checkEdges();
  mover.display();
}