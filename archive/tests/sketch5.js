var ball;
var pos;
var vel;
var acc;

function setup(){
	createCanvas(windowWidth,windowHeight);
	pos = createVector(width/2,height/2);
	vel = createVector(3,4);
	acc = createVector(0,10);

	ball = new FreeBodyMover(pos,vel,acc,10,color(255),1, true);
}

function draw(){
	background(0);
	ball.bounceEdges();
	ball.update();
	ball.display();
}

function FreeBodyMover(pos, vel, acc, mass, col, howManyForces_, showResultant_){
	// Mover parameters
	this.position = new createVector(pos.x, pos.y);
	this.velocity = new createVector(vel.x, vel.y);
	this.acceleration = new createVector(acc.x, acc.y);
	this.limit = 50;
	this.mass = mass;
	this.color = col;
	this.size = this.mass;
	this.outline = 255;
	this.tail = false;
	this.tailFill  = 'white';
	this.tailStroke = 'black';
	this.tailA = [];
	this.angle = 0;
	this.aVelocity = 0;
	this.aAcceleration = 0;

	// FBD parameter;
	this.mag = [];
    this.direction = [];
    this.labels = [];
    this.offsets = [];
    this.howManyForces = howManyForces_;
    this.showResultant = showResultant_;

    if(this.showResultant){
      forcesColor = color(240,150,150);
    }else{
      forcesColor = color(230, 40, 40);
    }

    if(this.showResultant){
	    resultant = new Arrow(pos,pos)
	    resultant.color = color(230, 40, 40);
	    resultant.grab = false;
	    resultant.draggable = false;
    }

    v1 = [];

    

    for (var i = 0; i < this.howManyForces; i++) {

        v1[i] = new Arrow(pos, p5.Vector.add(pos, createVector(this.mag[i] * cos(this.direction[i]), this.mag[i] * sin(this.direction[i]))));
        v1[i].grab = false;
        v1[i].draggable = false;
        v1[i].color = forcesColor;

    }


	this.update = function(){
  		if(this.tail === true){
    		this.tailA.push(this.position.copy());
  		}
		this.velocity.add(this.acceleration);
		this.velocity.limit(this.limit);
		this.position.add(this.velocity);
		this.acceleration.mult(0);

		var hCut = 70;
		if(this.tailA.length > hCut){
			this.tailA = this.tailA.slice(-1 * hCut);
		}
			  //handles angular momentum
		this.aVelocity += this.aAcceleration;
		this.angle += this.aVelocity;
	};


	this.display = function(){

		fill(this.color);
		stroke(this.outline);
		ellipse(this.position.x,this.position.y,this.size,this.size);

		if(this.tail === true){
			push();
			fill(this.tailFill);
			stroke(this.tailStroke);
			for(var i = 0; i < this.tailA.length; i++){
				ellipse(this.tailA[i].x,this.tailA[i].y,3,3);
			}
			pop();
		}
	};


	this.giveItAnAcceleration = function(accel){
		this.acceleration = (accel);
	};


	this.applyForce = function(force){
		var f = force.copy();
		f.div(this.mass);
		this.acceleration.add(f);
	};

//Behaviors
	this.wrapEdges = function() {

	  if (this.position.x > width) {
	    this.position.x = 0;
	  }
	  else if (this.position.x < 0) {
	    this.position.x = width;
	  }

	  if (this.position.y > height) {
	    this.position.y = 0;
	  }
	  else if (this.position.y < 0) {
	    this.position.y = height;
	  }
	};


	this.bounceEdges = function(){
	  if(this.position.x < 0+this.size/2){
	    this.velocity.x *= -1;
	    this.position.x = 0+this.size/2;

	  }
	  if(this.position.x > width-this.size/2){
	    this.velocity.x *= -1;
	    this.position.x = width-this.size/2;
	  }

	  if(this.position.y < 0+this.size/2){
	    this.velocity.y *= -1;
	    this.position.y = 0+this.size/2;

	  }
	  if(this.position.y > height-this.size/2){
	    this.velocity.y *= -1;
	    this.position.y = height-this.size/2;
	  }
	};


	this.towardMouse = function(a){
	  var mouse = new Vector(mouseX,mouseY);
	  var dir = Vector.sub(mouse,this.position);
	  dir.normalize();
	  dir.mult(a);
	  this.acceleration = dir;
	};

}