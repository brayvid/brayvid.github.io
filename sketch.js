function setup() {
  createCanvas(1200,700);
}

var xPos = 0;
var yPos = 700;
xInit = xPos;
yInit = yPos;
var g = .007;
var t = 1;
var xInitVel = 1.2;
var yInitVel = 2.8;

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



