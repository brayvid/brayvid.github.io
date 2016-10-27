var origin;
var v;
var r;
var r_;
var l;

function setup(){
	createCanvas(windowWidth,windowHeight);
	origin = createVector(width/2,height/2);

	v = new Arrow(origin,origin);
	v.color = color(0);
	v.width = 40;

}

function draw(){
	background(255);
	v.display();
}

function mouseMoved(){
	v.target.set(mouseX,mouseY);
}

