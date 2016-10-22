var pos;
var edges = [];
var arrs = [];

var oldDims; // critical

function setup(){
	createCanvas(windowWidth,windowHeight);
	pos = createVector(width/2,height/2);
	
	edgePoints();
	
	for (var i = 0; i < 4; i++){
		arrs[i] = new Arrow(pos,edges[i]);
		arrs[i].color = color(0);
		arrs[i].draggable = false;
		arrs[i].grab = false;
		arrs[i].width = 20;
	}
}

function draw(){
	background(255);

	edgePoints();

	for (var i = 0; i < 4; i++){
		arrs[i].origin = pos;
		arrs[i].target = edges[i];
		arrs[i].display();
	}

	centerPoint();

}

function edgePoints(){
	edges[0] = createVector(pos.x,0);
	edges[1] = createVector(width,pos.y);
	edges[2] = createVector(pos.x,height);
	edges[3] = createVector(0,pos.y);
}

function centerPoint(){
	d = dist(mouseX,mouseY,pos.x,pos.y);
	if(d < 10){
		fill(255);
	}else{
		fill(128);
	}
	ellipse(pos.x,pos.y,20,20);
}

function windowResized(){
	oldDims = createVector(width,height);
	resizeCanvas(windowWidth,windowHeight);
	pos.set(width*(pos.x/oldDims.x),height*(pos.y/oldDims.y)); // critical
	
	edgePoints();	
}

function mouseDragged(){
	pos.set(mouseX,mouseY);
}