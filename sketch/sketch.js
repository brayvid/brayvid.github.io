function setup() {
  createCanvas(1200,700);
}
// Position (constantly updated)
var xPos = 100;
var yPos = 700;

// First position
xInit = xPos;
yInit = yPos;

// Constants
var g = .01;

// Velocities
var xInitVel = 4;
var yInitVel = 3;

// Time counter
var t = 1;


function draw() {
  
if(yPos <= 700 && xPos <= 1200){
  background(0);
  fill(50,255,50);
  ellipse(xPos, yPos, 10,10);
  incPos(xPos, yPos);
}else{
    xPos = xInit;
    yPos = yInit;
    t=1;
}

}

function incPos(x,y){
  xPos = xInit + (xInitVel*t);
  yPos = yInit - (yInitVel*t) + .5*g*Math.pow(t,2);
  t++;
  
}




