var balls;
var count;
var started;

function setup(){
	balls = [];
	started = false;
	count = 0;
	createCanvas(windowWidth,windowHeight);
	frameRate(30);

}

function draw(){
	background(100);
	if(started){	
		for(var i = 0; i<count; i++){
			balls[i].edges();
			balls[i].mover.update();
			balls[i].diagram.update();
			balls[i].diagram.mag = balls[i].force();
			balls[i].diagram.direction = balls[i].force().normalize();
			balls[i].diagram.position = balls[i].mover.position;

			balls[i].mover.display();
			balls[i].diagram.display();
		}
	}
}

function mouseClicked(){
	var initPos = createVector(mouseX,mouseY);
	var initVel = createVector(0,0);
	var initAcc = createVector(0,20); // GRAVITY
	var initMass = floor(random(0,100))+1;
	var initColor = color(floor(random(0,255)),floor(random(0,255)),floor(random(0,255)));
	balls[count] = new FbdBall(initPos,initVel,initAcc,initMass,initColor);
	count++;
	started = true;
}

function FbdBall(p,v,a,m,c){
	this.mover = new Mover(p,v,a,m,c);
	this.diagram = new FBD(p,1,true);
	this.diagram.showLabels = false;
  	this.diagram.showResultant = false;
	this.diagram.xoffsets = [10];
	this.diagram.yoffsets = [0];
	this.diagram.labels = ['g'];

	this.force = function(){
		return p5.Vector.mult(this.mover.acceleration,this.mover.mass);
	}

	this.edges = function(){
		if(this.mover.position.x < 5 || this.mover.position.x > width -5 || this.mover.position.y < 5 || this.mover.position.y > height -5){
			this.mover.acceleration = createVector(0,0);
			this.mover.velocity = createVector(0,0);
		}
	}


}