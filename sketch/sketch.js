function setup() {
  createCanvas(1200,700);
}

var xPos = 100;
var yPos = 700;
xInit = xPos;
yInit = yPos;
var g = .007;
var t = 1;
var xInitVel = 1.2;
var yInitVel = 2.8;
var d = new Date();
var time = d.getTime();

function draw() {
  
  background(0);
  fill(50,255,50);
  ellipse(xPos, yPos, 10,10);
  incPos(xPos, yPos);
}

function incPos(x,y){
  xPos = xInit + (xInitVel*time);
  yPos = yInit - (yInitVel*time) + .5*g*Math.pow(time,2);
  incTime();
}

function incTime(){
  time = d.getTime() - time;
}



