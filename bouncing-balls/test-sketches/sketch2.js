var balls = [];
var initPos;
var initVel;
var initAcc;
var mass;
var initColor;
var start;
var count;

function setup(){
	frameRate(15);
	createCanvas(windowWidth, windowHeight);
	initPos = createVector(0,0);
	initVel = createVector(0,0);
	initAcc = createVector(0,20);
	mass = 100;
	initColor = color(0,0,0);
	start = false;
	count = 0;
}

function draw(){
	background(255);

	if(start){
		for(var i = 0; i<count; i++){
			// UPDATE ALL PROPERTIES OF EACH BALL
			balls[i].update();
		  	balls[i].fbd.mag = [balls[i].getForce()];
			balls[i].fbd.direction = [balls[i].getForce().normalize()]
		}
		console.log(balls[0].getForce().x + ", " + balls[0].getForce().y);
	}
}

function Ball(p,v,a,m,c){

	this.mover = new Mover(p,v,a,m,c);
	this.mover.limit = 999999;
	this.fbd = new FBD(p,1,true);
	this.fbd.showLabels = true;
  	this.fbd.showResultant = false;
	this.fbd.xoffsets = [0];
	this.fbd.yoffsets = [0];
	this.fbd.labels = ['g'];
	this.getForce = function(){
		return p5.Vector.mult(this.mover.acceleration,this.mover.mass);
	};
	this.fbd.dir = this.getForce().normalize();

	


	this.update = function(){
		this.stopAtEdge();
		this.fbd.position = this.mover.position;
		this.fbd.mag = this.getForce();
		this.mover.update();
		this.fbd.update();
		this.mover.display();
		this.fbd.display();
	};

	this.stopAtEdge = function(){
		if(this.mover.position.x < 5 || this.mover.position.x > width -5 || this.mover.position.y < 5 || this.mover.position.y > height -5){
			this.mover.acceleration = createVector(0,0);
			this.mover.velocity = createVector(0,0);
			noLoop();
		}
	};

}

function mouseClicked(){
	initPos = createVector(mouseX,mouseY);
	// CREATES NEW BALL FOR EACH TOUCH 
	balls[count] = new Ball(initPos,initVel,initAcc,mass,initColor);

	// balls[count].fbd.mag = [force[count],createVector(0,0)];
	// balls[count].direction = [force[count].div(force[count].mag()),createVector(0,0)]
	start = true;
	count++;
}


function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}