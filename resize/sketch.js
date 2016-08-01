var myWindowWidth;
var myWindowHeight;

function setup() {
/*
Kevin Gutowski - https://github.com/processing/p5.js/issues/314
*/
var test = createCanvas(displayWidth, displayHeight); //create a Canvas that accounts for all possible windowSizes
test.position(0,0); //please have p5.dom.js activated in the html
myWindowHeight = windowHeight;
myWindowWidth = windowWidth;


}

function draw() {
  
/*
Kevin Gutowski - https://github.com/processing/p5.js/issues/314
*/
translate(myWindowWidth/2,myWindowHeight/2);
noStroke();
fill(128);
rect(-myWindowWidth/2,-myWindowHeight/2,myWindowWidth,myWindowHeight);
}

window.onresize = resize;

function resize() {
myWindowWidth = windowWidth;
myWindowHeight = windowHeight;
println("myWindowWidth = " + windowWidth + " & " + "myWindowHeight = " + windowHeight);
}