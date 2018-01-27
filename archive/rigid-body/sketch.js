var initPosition;
var initMass;
var initEnergy;
var initDims;

var block;

function setup(){
	createCanvas(windowWidth,windowHeight);

	initPosition = createVector(width/2,height/2); //  |m,m|
	initMass = 10; //  |kg|
	initEnergy = 1000; 	// |J|
	initDims = createVector(50,50)	// |m,m|


	block = new RigidBody(initPosition,initMass,initEnergy,initDims);

}

function draw(){

	background(128);
	block.display();
	
}


function RigidBody(p,m,e,d){
	this.pos = p;
	this.mass = m;
	this.energy = e;
	this.velocity = sqrt(2*this.energy/this.mass);
	this.corners = [createVector(this.pos.x - d.x,this.pos.y - d.y),createVector(this.pos.x + d.x,this.pos.y - d.y),createVector(this.pos.x + d.x,this.pos.y + d.y),createVector(this.pos.x - d.x,this.pos.y + d.y)];
	
	// this.update = function(){
	// 	for(var i = 0; i < this.corners.length; i++){
	// 		this.corners[i].add(this.vel)
	// 	}

	// }



	this.display = function(){
		beginShape();
		for(var i = 0; i < this.corners.length; i++){
			vertex(this.corners[i].x,this.corners[i].y);
		}
		endShape();
	}

}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}