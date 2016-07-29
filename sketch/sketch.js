function setup() {
  createCanvas(1200, 700);
}

// Gravity
var g = .018;

// Initial position
xInit = 100;
yInit = 700;

// Position (constantly updated)
var xPos = xInit;
var yPos = yInit;

// Velocities
var xInitVel;
var yInitVel;

// Ask for velocities
getXVel();
getYVel();

// Time
var t = 1;


function draw() {

  if (yPos <= 700 && xPos <= 1200) {
    background(0);
    fill(50, 255, 50);
    ellipse(xPos, yPos, 10, 10);
    incPos(xPos, yPos);
  } else {
    xPos = xInit;
    yPos = yInit;
    t = 1;
  }

}

function getXVel() {

  var again = true;
  while (again) {
    var inp1 = window.prompt("x velocity", "30");
    if (isPositiveNumber(inp1)) {
      setXVel(inp1);
      again = false;
    }
  }
}

function getYVel() {
  var again = true;
  while (again) {
    var inp1 = window.prompt("y velocity", "30");
    if (isPositiveNumber(inp1)) {
      setYVel(inp1);
      again = false;
    }
  }
}

function setXVel(val) {
  xInitVel = val / 10;
}

function setYVel(val) {
  yInitVel = val / 10;
}

function isPositiveNumber(s) {
  return true;
}

function incPos(x, y) {
  xPos = xInit + (xInitVel * t);
  yPos = yInit - (yInitVel * t) + .5 * g * Math.pow(t, 2);
  t = t + 4;

}