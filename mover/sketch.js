var pos;
var vel;
var acc;
var ball;
var guide;

function setup(){
	frameRate(120);
	createCanvas(windowWidth,windowHeight);
	d = createVector(width/2,height/2);
	v = createVector(0,0);
	a = createVector(0,0);
	ball = new Mover(d,v,a,30,'red');
	guide = new Arrow(d, createVector(width/2,height/2-50));
	guide.color = color(0);
	guide.width = 8;
}

function draw(){
	background(255);

	ball.update();
	guide.update();

	if(ball.velocity.x == 0 && ball.velocity.y == 0){
		guide.display();
	}
	ball.display();
	ball.bounceEdges();
}

function mousePressed(){
	ball.velocity = createVector(0,0);
	guide.origin = createVector(ball.position.x,ball.position.y);
	guide.target = createVector(mouseX,mouseY);	
}

function mouseReleased(){
	ball.acceleration = p5.Vector.sub(createVector(mouseX,mouseY),guide.origin);
}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}
