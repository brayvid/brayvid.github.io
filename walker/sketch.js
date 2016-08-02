function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  frameRate(30);
}

  var xPos = window.innerWidth/2;
  var yPos = window.innerHeight/2;
  
function draw() {

  
  
  background(0);
  
  if(xPos<width-50 && xPos>50 && yPos<height-50 && yPos>50){
    fill(255);
    ellipse(xPos,yPos,50,50);
    xPos = Math.random()*103 - 51 + xPos;
    yPos = Math.random()*97 - 50 + yPos;
    
  }
  else{
    fill(25,255,25);
    ellipse(xPos,yPos,50,50);
  }
  
  
}