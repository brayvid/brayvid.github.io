charges = [];

function setup(){
	createCanvas(windowWidth,windowHeight);
	charges[0] = new Particle(createVector(width/2,height/2),30);
}


function draw(){
	background(255);
	if(charges.length > 0){
		for(var i = 0; i < charges.length; i++){
			charges[i].display();
		}
	}
}


function Particle(p,c){
	this.position = p;
	this.charge = c;
	if(this.charge > 0){
		this.color = color(255,0,0);
	}else if(this.charge < 0){
		this.color = color(0,0,255);
	}
	

	this.getForce = function(other){
		var r = dist(this.position.x,this.position.y,other.position.x,other.position.y);
		var rHat = p5.Vector.sub(other.position,this.position).normalize();
		var k = 9*Math.pow(10,9);
		var q1 = this.charge;
		var q2 = other.charge;
		var forceVector = p5.Vector.add(this.position,p5.Vector.mult(k*q1*q2/Math.pow(r,2),rHat));
		return forceVector;
	}

	this.display = function(){
		push();
		fill(this.color);
		noStroke();
		ellipse(this.position.x,this.position.y,10,10);
		pop();
	}
}


