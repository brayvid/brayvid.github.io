function setup() {
  createCanvas(736,408);
  frameRate(60);
}

function draw() {
  background(0);
  
  fill(255);
  stroke(30,255,30);
  
  var originX = 150;
  var originY = height-100;
  
  var ptX = mouseX;
  var ptY = mouseY;
  
  ellipse(originX,originY,10,10);
  line(originX,originY,ptX,ptY);
  ellipse(ptX,ptY,10,10);
  
  stroke(69,63,127);
  strokeWeight(2);
  line(originX,originY,mouseX,originY);
  stroke(136,34,17);
  line(mouseX,mouseY,mouseX,originY);
  

  text();
  
}