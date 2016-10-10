var pos;
var vel;
var acc;

var ball;

var block;

function setup(){
	frameRate(120);
	createCanvas(windowWidth,windowHeight);
	d = createVector(width/2,height-50);
	v = createVector(0,0);
	a = createVector(0,0);
	ball = new Mover(d,v,a,10,'red');
}

function draw(){
	background(252);


	push();
	rectMode(CENTER);
	fill(50,50,50);
	stroke(0);
	rect(width/2,height-23,200,45);
	pop();

	push();
	
	pop();

	ball.update();
	ball.display();
	ball.bounceEdges();

}



function mousePressed(){
	// ball.velocity = createVector(5,0);
	ball.acceleration = p5.Vector.add(ball.acceleration,createVector(0,-2));
}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}
