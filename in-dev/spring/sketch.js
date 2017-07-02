var massSlider, frictionSlider, springSlider;
var histories, paused;
var spring;
var eqPos;

function preload(){
  spring = loadImage('spring.jpg');
}

function setup(){
  noLoop();
  createCanvas(3*windowWidth/4-25,windowHeight/2);

  frameRate(26);

  massSlider = createSlider(1,10,5,0.5);
  massSlider.position(25,windowHeight/4+50);
  massSlider.style('width', (windowWidth/4-50)+'px');
  histories = [];
  paused = true;
  eqPos = createVector(0.045*width,0.5*height);
}



function draw(){
  var temp;
  background(255);
  push();
  fill(255);
  stroke(0);
  rect(0,0,width-1,height-1); // border
  pop();

  push();
  imageMode(CORNER);
  fill(100);
  temp = displ();
  image(spring,eqPos.x-20,61,40,eqPos.y+temp-78);
  pop();

  push();
  rectMode(CENTER);
  fill(100);
  rect(eqPos.x,30,0.06*width,60);
  pop();

  push();
  ellipseMode(CENTER);
  fill(100,100,255);
  ellipse(eqPos.x,eqPos.y+temp,40);
  pop();

  push();
  beginShape();
  noFill();
  for(var i = 0; i < histories.length; i++){
    vertex(100 + (i*((width-50)/200)),height/2+histories[i]);
  }
  endShape();
  pop();
}

function displ(){
  var pos = 2*(height/6)*exp(-frameCount/16)*cos((frameCount/1.5));
  histories.push(pos);
  return pos;
}
function windowResized(){
  resizeCanvas(windowWidth/2,windowHeight/2);
  massSlider.position(25,windowHeight/4+50);
  massSlider.style('width', (windowWidth/4-50)+'px');
  eqPos.set(0.1*width,0.5*height);
}

function keyPressed(){
  if(keyCode == 32 && !paused){
    noLoop();
    paused = true;
  }else if(keyCode == 32 && paused){
    loop();
    paused = false;
  }
}