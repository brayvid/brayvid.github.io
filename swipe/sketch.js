var balls;
var beginDist;
var endDist;
var newVelocity;
var beginTime;
var endTime;
var globalAcc;
var started;
var currentTime;
var touchTime;
var currentFrameRate;
var randColor;
var globalAccOn;
var deviceHasMoved = false;
var numberOfCollisions;
var previousNumberOfCollisions;

function FreeBodyMover(p, v, a, m, c){

	// Properties
	this.position = p;
	this.velocity = v;
	this.acceleration = a;
	this.mass = m;
	this.size = 75;
	this.color = c;
	this.appliedForce = p5.Vector.mult(this.acceleration,this.mass);
	this.forceArrow = new Arrow(this.position,p5.Vector.add(this.position,this.appliedForce));
	this.forceArrow.color = color(0);
	this.forceArrow.grab = false;
	this.forceArrow.draggable = false;
	this.forceArrow.width = 10;

	this.velocityArrow = new Arrow(this.position,p5.Vector.mult(p5.Vector.add(this.position,this.velocity),2));
	this.velocityArrow.color = this.color;
	this.velocityArrow.grab = false;
	this.velocityArrow.draggable = false;

	this.momentum = p5.Vector.add(this.velocity,this.mass);
	this.kineticEnergy = 0.5 * this.mass * (Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2));

	// Methods
	// this.act = function(force){
	// 	// add a force to the array of acting forces
	// 	this.fbd.forces[this.fbd.forces.length+1] = force;
	// }; //end act()

	this.refresh = function(){
		  	// "bounceEdges" from science.js by http://github.com/hedbergj
		  	// Still needed: "Apply Force" 
			  if(this.position.x < 0+this.mass/2){
				 overinx = this.position.x-this.mass/2;
				 vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
				 this.velocity.x = 0.97*vatwidth;
				 this.position.x = 0+this.mass/2; 
			 	 }

			  if(this.position.x > width-this.mass/2){
			    overinx = this.position.x-width+this.mass/2;
			    vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
			    this.position.x = width-this.mass/2;
			    this.velocity.x = -0.97*vatwidth;
			  }

			  if(this.position.y < 0+this.mass/2){
			    overiny = this.position.y-this.mass/2;
			    vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
			    this.velocity.y = 0.97*vatheight;
			    this.position.y = 0+this.mass/2;
			  }

			  if(this.position.y > height-this.mass/2){
			    overiny = this.position.y-height+this.mass/2;
			    vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
			    this.position.y = height-this.mass/2;
			    this.velocity.y = -0.97*vatheight;
			  }	
			 // End bounceEdges

	   		// Recalculate position then velocity 
	   		this.acceleration = p5.Vector.add(createVector(0,0),globalAcc);
			this.velocity = p5.Vector.add(this.velocity,this.acceleration);
			this.kineticEnergy = 0.5 * this.mass * (Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2));
			this.position = p5.Vector.add(this.position,this.velocity);
			this.momentum = p5.Vector.mult(this.velocity,this.mass);
			
			
			// Draw force arrow
			this.appliedForce = p5.Vector.mult(this.acceleration,this.mass);
			this.forceArrow.origin = this.position;
			this.forceArrow.target = p5.Vector.add(this.position,this.appliedForce);
			this.forceArrow.display();

			// Draw velocity arrow
			this.velocityArrow.origin = this.position;
			this.velocityArrow.target = p5.Vector.add(this.position,this.velocity);
			this.velocityArrow.display();


			// Redraw
			push();
			fill(this.color);
			ellipse(this.position.x,this.position.y,this.mass,this.mass);
			pop();

	}; // end update method

	this.intersects = function(other){
		var d = dist(this.position.x,this.position.y,other.position.x,other.position.y);
		if(d < (this.mass/2) + (other.mass/2)){
			return true;
		}else{
			return false;
		}
	}

	this.newColor = function(other){
		
		var r;
		var g;
		var b;
		var a;

		// Ball with greater momentum spreads color
		if(p5.Vector.mag(other.momentum) > p5.Vector.mag(this.momentum)){
			var r = map(other.color._array[0],0,1,0,255);
			var g = map(other.color._array[1],0,1,0,255);
			var b = map(other.color._array[2],0,1,0,255);
			var a = map(other.color._array[3],0,1,0,255);
			this.color = color(r,g,b,a);
			this.velocityArrow.color = color(r,g,b,a);
		}else{
			var r = map(this.color._array[0],0,1,0,255);
			var g = map(this.color._array[1],0,1,0,255);
			var b = map(this.color._array[2],0,1,0,255);
			var a = map(this.color._array[3],0,1,0,255);
			other.color = color(r,g,b,a);
			other.velocityArrow.color = color(r,g,b,a);
		}

		
		

	}
}// End FreeBodyMover object


function setup(){
	frameRate(60);
	currentFrameRate = frameRate();
	createCanvas(windowWidth,windowHeight);
	balls = [];
	globalAcc = createVector(0,0);
	globalAccOn = true;
	started = false;
	currentTime = millis();
	randColor = color(random(0,255),random(0,255),random(0,255),random(100,200));
	setMoveThreshold(0.01);
	numberOfCollisions = 0;
}


function draw(){
	background(255);
	// console.log('deviceHasmoved == '+deviceHasMoved);
	// push();
	// fill(randColor);
	// ellipse(mouseX,mouseY,50,50);
	// pop();

	// Get time for intervals
	currentTime = millis();

	// Display framerate
	push();
	textSize(24);
	if(round(currentTime) % 10 == 0){
		currentFrameRate = round(frameRate());
	}
	text(currentFrameRate,30, height-25);
	pop();
	

	push();
	textSize(24);
	textAlign(CENTER);
	var totalKE = 0;
	for(var i = 0; i < balls.length; i++){
		totalKE = totalKE + balls[i].kineticEnergy;
	}
	text('Total KE:',width-75,height-45);
	text(round(totalKE) + ' J',width-75,height-20);
	pop();

	// Display intro until first touch
	if(!started){
		push();
		textAlign(CENTER);
		textSize(width/15);
		fill(25);
		if(deviceHasMoved){
			push();
			textSize(width/20);
			text('--Disable screen rotation--',width/2,(height/2)-40);
			pop();
		}else{
			push();
			textSize(width/25);
			text('Gravity unavailable - switch to mobile',width/2,(height/2)-70);
			pop();
		}

		text('Tap or swipe to launch',width/2,(height/2)+30);
		
		
		pop();
	}

	if(globalAccOn){
		// Recalculate acceleration based on device rotation
		globalAcc.x = map(constrain(rotationY,-45,45),-45,45,-2,2);
		globalAcc.y = map(constrain(rotationX,-45,45),-45,45,-2,2);
	}

	// Collisions
	for(var i = 0; i < balls.length; i++){
		for(var j = 0; j < balls.length; j++){
			if(i != j && balls[i].intersects(balls[j])){

				var collisionPoint = createVector(
					// X coord
					((balls[i].position.x * balls[j].mass/2) + (balls[j].position.x * balls[i].mass/2)) 
				 	/ (balls[i].mass/2 + balls[j].mass/2),
				 	// Y coord
				 	((balls[i].position.y * balls[j].mass/2) + (balls[j].position.y * balls[i].mass/2)) 
				 	/ (balls[i].mass/2 + balls[j].mass/2)
				);

				// var heading1 = degrees(balls[i].velocity.heading());
				// var heading2 = degrees(balls[j].velocity.heading());
				// console.log(balls[i] + ' intersects ' + balls[j]);
				// console.log('heading 1: '+ heading1 + ', heading 2: '+ heading2);
				// console.log(collisionPoint.x + ", "+ collisionPoint.y);
				// ellipse(collisionPoint.x,collisionPoint.y,10,10);

				// Calculate resultant velocities
				var newVelX1 = (balls[i].velocity.x * (balls[i].mass - balls[j].mass) + (2 * balls[j].mass * balls[j].velocity.x)) / (balls[i].mass + balls[j].mass);
				var newVelY1 = (balls[i].velocity.y * (balls[i].mass - balls[j].mass) + (2 * balls[j].mass * balls[j].velocity.y)) / (balls[i].mass + balls[j].mass);
				var newVelX2 = (balls[j].velocity.x * (balls[j].mass - balls[i].mass) + (2 * balls[i].mass * balls[i].velocity.x)) / (balls[i].mass + balls[j].mass);
				var newVelY2 = (balls[j].velocity.y * (balls[j].mass - balls[i].mass) + (2 * balls[i].mass * balls[i].velocity.y)) / (balls[i].mass + balls[j].mass);

				// Update positions to prevent sticking
				balls[i].position.x = balls[i].position.x + newVelX1;
				balls[j].position.x = balls[j].position.x + newVelX2;
				balls[i].position.y = balls[i].position.y + newVelY1;
				balls[j].position.y = balls[j].position.y + newVelY2;

				// Update velocities with calculated ones
				balls[i].velocity = createVector(newVelX1,newVelY1);
				balls[j].velocity = createVector(newVelX2,newVelY2);

				balls[i].newColor(balls[j]);
				

				numberOfCollisions++;
				// console.log('collisions: ' + numberOfCollisions);
				


				// var collisionMomentum = p5.Vector.add(balls[i].momentum,balls[j].momentum);
				// // var angle = p5.Vector.angleBetween(balls[i].velocity,balls[j].velocity);


				
				// // Finish collision math

				
				// // console.log(180*angle/PI);
				






			}
		}
	}

	// if(false){
	// 	if(deviceOrientation == 'portrait' && rotationX > 0){ // normal phone orientation
	// 		globalAcc.x = map(constrain(rotationY,-50,50),-50,50,-0.8,0.8);
	// 		globalAcc.y = map(constrain(rotationX,-50,50),-50,50,-0.8,0.8);

	// 	}else if(rotationX < 0){ // Upside down portrait
	// 		globalAcc.x = map(constrain(rotationY,-50,50),-50, 50,0.8,-0.8);
	// 		globalAcc.y = map(constrain(rotationX,-50,50),-50, 50,0.8,-0.8); // flip signs

	// 	}else if(deviceOrientation == 'landscape' && rotationY > 0){  // Clockwise landscape
	// 		globalAcc.x = map(constrain(rotationX,-50,50),-50,50,0.8,-0.8); 
	// 		globalAcc.y = map(constrain(rotationY,-50,50),-50,50,-0.8,0.8);

	// 	}else if(rotationY < 0){ // Counterclockwise landscape
	// 		globalAcc.x = map(constrain(rotationX,-50,50),-50,50,0.8,-0.8);
	// 		globalAcc.y = map(constrain(rotationY,-50,50),50,-50,-0.8,0.8);
	// 	}else{

	// 	}
	// }

	// if(deviceOrientation == 'landscape' && rotationY < 0){
	// globalAcc.x = map(constrain(rotationX,-50,50),-50,50,-0.2,0.2);
	// globalAcc.y = map(constrain(rotationY,-50,50),-50,50,-0.2,0.2);
	// }

	// if(deviceOrientation == 'landscape' && rotationY > 0){
	// globalAcc.x = map(constrain(rotationY,-50,50),-50,50,0.2,-0.2);
	// globalAcc.y = map(constrain(rotationX,-50,50),-50,50,-0.2,0.2);
	// }


	// Update balls
	for(var i = 0; i < balls.length; i++){
		balls[i].refresh();
	}

	// Limit number of balls created
	if(balls.length > 50){
		for(var i = 0; i < balls.length-1; i++){
		balls.splice(i,1);
		}
	}

	// console.log('x: ' + rotationX +',y: '+rotationY);

	// if(balls.length > 0){
	// 	console.log(balls[0].acceleration);
	// }
}

function touchStarted(){
	// Record time of first touch
	if(!started){
		touchTime = millis();
		started = true;
	}
	// Start measuring for initial velocity
	timeStarted = millis();
	beginDist = createVector(mouseX,mouseY);
	beginTime = millis();
}

function touchEnded(){
	// Calculate initial velocity
	endDist = createVector(mouseX, mouseY);
	endTime = millis();
	var interval = endTime - beginTime;
	newVelocity = p5.Vector.div(p5.Vector.mult(p5.Vector.sub(endDist,beginDist),4),interval/4);

	// Make a new ball
	randColor = color(random(0,255),random(0,255),random(0,255),random(100,200));
	balls[balls.length] = new FreeBodyMover(createVector(mouseX,mouseY),createVector(newVelocity.x,newVelocity.y),createVector(globalAcc.x,globalAcc.y),map(interval,0,500,25,150),randColor);
}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}

function deviceMoved(){
	deviceHasMoved = true;
}
