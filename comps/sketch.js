function setup() {

  frameRate(30);
}

var posX;
var posY;
var velX;
var velY;


function draw() {
  fill(255);
  stroke(255);
  var originX = 10;
  var originY = windowHeight - 10;

  // note that createcanvas is in the draw function
  createCanvas(windowWidth, windowHeight);

  background(0);

  // main vector
  stroke(0, 255, 0);
  line(originX, originY, mouseX, mouseY);

  // main vector text
  fill(255);
  noStroke();
  var pxFromBottom = height - mouseY;
  var pxFromLeft = mouseX;
  text(floor(dist(originX,originY,mouseX+10,mouseY))+" px @ " + round((180/PI)*atan(pxFromBottom/pxFromLeft))+"°", mouseX + 10, mouseY - 10);

  // X component
  stroke(255, 0, 0);
  line(originX, originY, mouseX, originY);
  fill(255);
  noStroke();
  text(mouseX + " px", mouseX + 10, originY);

  // Y component
  stroke(50, 50, 200);
  line(originX, mouseY, originX, originY);
  fill(255);
  noStroke();
  text(pxFromBottom + " px", originX, mouseY - 10);

  // Circles
  ellipse(mouseX, mouseY, 20, 20);
  ellipse(originX, originY, 20, 20);
}