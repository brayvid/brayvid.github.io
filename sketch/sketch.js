function setup() {
  createCanvas(1200,700);
}

var xPos = 100;
var yPos = 700;
xInit = xPos;
yInit = yPos;
var g = .01;
var t = 1;
var xInitVel = 1;
var yInitVel = 3;
var d = new Date();
var initTime = d.getTime();
var time = initTime;

function draw() {
  
  background(0);
  fill(50,255,50);
  ellipse(xPos, yPos, 10,10);
  incPos(xPos, yPos);
}

function incPos(x,y){
  xPos = xInit + (xInitVel*t);
  yPos = yInit - (yInitVel*t) + .5*g*Math.pow(t,2);
  t++;
  
}




