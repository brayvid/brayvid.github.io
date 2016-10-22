function setup(){
	createCanvas(windowWidth,windowHeight);
	textAlign(CENTER);
	textSize(40);
	fill(255);
}

function draw(){
	background(42);
	text("Hello, world.",width/2,height/2);

}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}