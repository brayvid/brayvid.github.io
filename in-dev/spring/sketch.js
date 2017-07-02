var massSlider, frictionSlider, springSlider;
var histories, paused;

function setup(){
  createCanvas(3*windowWidth/4-25,windowHeight/2);
  frameRate(30);

  massSlider = createSlider(1,10,5,0.5);
  massSlider.position(25,windowHeight/4+50);
  massSlider.style('width', (windowWidth/4-50)+'px');
  histories = [];
  paused = false;
}



function draw(){
  background(255);
  fill(255);
  stroke(0);
  rect(0,0,width-1,height-1);
  fill(100);
  push();
  rectMode(CENTER);
  rect(50,65/2,25,65);

  pop();

  push();
  ellipseMode(CENTER);
  fill(100,100,255);
  ellipse(50,height/2+displ(),40);
  pop();

  push();
  beginShape();
  noFill();
  for(var i = 0; i < histories.length; i++){
    vertex(100 + i*((width-50)/100),height/2+histories[i]);
  }
  endShape();
  pop();
}

function displ(){
  var pos = (height/6)*1.04*exp(-frameCount/10)*cos((frameCount/1.5));
  histories.push(pos);
  return pos;
}
function windowResized(){
  resizeCanvas(windowWidth/2,windowHeight/2);
  massSlider.position(25,windowHeight/4+50);
  massSlider.style('width', (windowWidth/4-50)+'px');
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