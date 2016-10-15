var fbd = [];
var testForces = [];
var testPositions = [];
var count;

function setup(){
	createCanvas(windowWidth,windowHeight);
	count = 0;
	

	for(var i = 0; i < 10; i++){
		testForces[i] = createVector(random(-100,100),random(-100,100));
		testPositions[i] = createVector(random(0,width),random(0,height));
	}

	frameRate(1);


}

function draw(){

	fbd[count] = new FreeBody(testPositions[count], testForces);
	count++;
	background(0);
	for(var i = 0; i < fbd.length; i++){

		
		fbd[i].display();

	}
	// fbd.move(createVector(random(0,width),random(0,height)));

}

// ARGS: position (vector) and forces (array of vectors) 
// RETURNS: an Arrow representing the net force
function FreeBody(pos, forces){
	this.color = color(floor(random(0,255)),floor(random(0,255)),floor(random(0,255)));
	this.position = pos;


	this.addForces = function(p,f){
		var netForce = createVector(0,0);
		for(var i = 0; i < f.length; i++){
			netForce.add(forces[i]);
		}
		return netForce;
	}

	this.netForceArrow = new Arrow(pos,p5.Vector.sub(pos,this.addForces(pos,forces)));

	this.display = function(){
		push();
		noStroke();
		fill(this.color);
		this.netForceArrow.display();


	}

	this.move = function(newPos){
		
	}

}

