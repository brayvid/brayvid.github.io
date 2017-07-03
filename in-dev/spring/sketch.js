var dampingSlider, dampingTitle, frictionSlider, springSlider, mainTitle;
var histories, paused;
var spring;
var eqPos;
var reset;
var tempFrameCount;

function preload(){
  spring = loadImage('spring.png');
}

function setup(){
  tempFrameCount = 1;
  noLoop();
  createCanvas(3*windowWidth/4-25,windowHeight/2);

  frameRate(30);

  dampingSlider = createSlider(0.1,25,10,0.1);
  dampingSlider.position(25,windowHeight/4+50);
  dampingSlider.style('width', (windowWidth/4-50)+'px');
  dampingSlider.input(function(){
    tempFrameCount = frameCount;
    histories = [];
    reset = true;
  });
  histories = [];
  paused = true;
  reset = false;
  eqPos = createVector(0.045*width,0.5*height);
  dampingTitle = createElement('h3','Damping Force');
  dampingTitle.position(width/8,windowHeight/4+20);
  mainTitle = createElement('h1','Spacebar to run/pause, R to reset');
  mainTitle.position(windowWidth/3.2,windowHeight/10);
}



function draw(){
  var disp;
  if(reset){
    disp = 12;
    reset = false;
    }else{
      disp = displ();
    }
  background(255);
  push();
  fill(255);
  stroke(0);
  rect(0,0,width-1,height-1); // border
  pop();

  push();
  stroke(255,0,0);
  line(0,height/2,width,height/2);
  pop();

  push();
  imageMode(CORNER);
  fill(100);
  image(spring,eqPos.x-20,61,40,eqPos.y+disp-78);
  pop();

  push();
  rectMode(CENTER);
  fill(100);
  rect(eqPos.x,30,0.06*width,60);
  pop();

  push();
  ellipseMode(CENTER);
  fill(100,100,255);
  ellipse(eqPos.x,eqPos.y+disp,40);
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
  var pos = 1.6*(height/6)*exp(-((frameCount - tempFrameCount))/(33-dampingSlider.value()))*cos(0.4*(frameCount - tempFrameCount));
  histories.push(pos);
  return pos;
}
function windowResized(){
  resizeCanvas(3*windowWidth/4-25,windowHeight/2);
  dampingSlider.position(25,windowHeight/4+50);
  dampingTitle.position(width/8,windowHeight/4+20);
  dampingSlider.style('width', (windowWidth/4-50)+'px');
  eqPos.set(0.1*width,0.5*height);
  mainTitle.position(windowWidth/3.2,windowHeight/10);
}

function keyPressed(){
  if(keyCode == 82){
    histories = [];
    reset = true;
    tempFrameCount = frameCount;
    loop();
    paused = false;
  }
  if(keyCode == 32 && !paused){
    noLoop();
    paused = true;
  }else if(keyCode == 32 && paused){
    loop();
    paused = false;
  }
}

