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
  
  createCanvas(windowWidth,windowHeight);
  
  background(0);
  
  ellipse(originX,originY,20,20);
  
  ellipse(mouseX,mouseY,20,20);
  stroke(0,255,0);
  line(originX,originY,mouseX,mouseY);
  stroke(255,0,0);
  line(originX,originY,mouseX,originY);
  stroke(0,0,255);
  line(originX,mouseY,originX,originY);

}

