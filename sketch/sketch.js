var angSlider, velSlider, button;

function setup() {
  createCanvas(1300, 700);
  textSize(15);
  
  angSlider = createSlider(1, 90, 80);
  angSlider.position(20, 20);
  velSlider = createSlider(1, 10, 5.2);
  velSlider.position(20, 50);
  
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
  
  xInitVel = velSlider.value() * Math.cos(3.14 * angSlider.value() / 180);
  yInitVel = velSlider.value() * Math.sin(3.14 * angSlider.value() / 180);
  
  background(0);
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