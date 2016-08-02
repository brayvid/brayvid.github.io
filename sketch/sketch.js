var angSlider, velSlider, button;

function setup() {
  createCanvas(windowWidth,windowHeight);
  frameRate(60);
  noStroke();
  textSize(15);
  
  // Bouncing ball
  //choose random vectors for the balls initial motion
  pos = createVector(random(0,width),random(0,height))
  vel = createVector(random(-5,5),random(-5,5));
  accel = 0;
  //make the ball! It is an instance of the mover object
  ball = new Mover(pos,vel,accel,10,'red');
  
  // End bouncing ball
  
  
  
  velSlider = createSlider(1, 10, 5.2);
  velSlider.position(20, 50);
  angSlider = createSlider(1, 90, 80);
  angSlider.position(20, 20);
  
  
  button = createButton('launch');
  button.position(240, 35);
}

// launch button
var launch = false;

// Gravity
var g = .018;

// Initial position
var xInit = 100;
var yInit = 700;

// Position (constantly updated)
var xPos = xInit;
var yPos = yInit;

// Velocities
var xInitVel;
var yInitVel;

// Ask for velocities
// getXVel();
// getYVel();

// Time
var t = 1;

function draw() {
  background(0);
  
  // Bouncing ball
  
  //update the position
  ball.update();
  //make the ball bounce
  ball.bounceEdges();
  //display changes
  ball.display();
  
  // End bouncing ball
  
  xInitVel = velSlider.value() * Math.cos(3.14 * angSlider.value() / 180);
  yInitVel = velSlider.value() * Math.sin(3.14 * angSlider.value() / 180);
  
  
  if(!launch){
    fill(50, 255, 50);
    ellipse(xInit, yInit, 10, 10);
  }
  text("angle", 190, 35);
  text("speed", 190, 65);
  
  text("1",5,35);
  text(angSlider.value(),160,35);
  
  text("1",5,65);
  text(velSlider.value(),160,65);
  
  button.mousePressed(mouseWasPressed);
  
  if (yPos <= 700 && xPos <= 1300 && launch) {
    // the guts
    fill(50, 255, 50);
    ellipse(xPos, yPos, 10, 10);
    incPos(xPos, yPos);
  } else {
    reset();
    return;
    //
    //t = 1;
    
  }
}

// guts
function incPos(x, y) {
  xPos = xInit + (xInitVel * t);
  yPos = yInit - (yInitVel * t) + .5 * g * Math.pow(t, 2);
  t = t + 4;
}

function reset(){
  xPos = xInit;
  yPos = yInit;
  t=1;
  launch = false;
}

function mouseWasPressed(){
  launch = true;
}

// function getXVel() {

//   var again = true;
//   while (again) {
//     var inp1 = window.prompt("x velocity", "30");
//     if (isPositiveNumber(inp1)) {
//       setXVel(inp1);
//       again = false;
//     }
//   }
// }

// function getYVel() {
//   var again = true;
//   while (again) {
//     var inp1 = window.prompt("y velocity", "30");
//     if (isPositiveNumber(inp1)) {
//       setYVel(inp1);
//       again = false;
//     }
//   }
// }

// function setXVel(val) {
//   xInitVel = val / 10;
// }

// function setYVel(val) {
//   yInitVel = val / 10;
// }

// function isPositiveNumber(s) {
//   return true;
// }