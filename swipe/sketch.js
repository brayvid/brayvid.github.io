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

function FreeBodyMover(p, v, a, m, c){

	// Properties
	this.position = p;
	this.velocity = v;
	this.acceleration = a;
	this.mass = m;
	this.color = c;
	this.appliedForce = p5.Vector.mult(this.acceleration,this.mass);
	this.forceArrow = new Arrow(this.position,p5.Vector.add(this.position,this.appliedForce));
	this.forceArrow.color = this.color;
	this.forceArrow.grab = false;
	this.forceArrow.draggable = false;

	this.momentum = p5.Vector.add(this.velocity,this.mass);
	this.kineticEnergy = 0.5 * this.mass * (Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2));

	// Methods
	// this.act = function(force){
	// 	// add a force to the array of acting forces
	// 	this.fbd.forces[this.fbd.forces.length+1] = force;
	// }; //end act()

	this.refresh = function(){
		  	// "bounceEdges" from science.js by http://github.com/hedbergj
			  if(this.position.x < 0+this.mass/2){
				 overinx = this.position.x-this.mass/2;
				 vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
				 this.velocity.x = 1*vatwidth;
				 this.position.x = 0+this.mass/2; 
			 	 }

			  if(this.position.x > width-this.mass/2){
			    overinx = this.position.x-width+this.mass/2;
			    vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
			    this.position.x = width-this.mass/2;
			    this.velocity.x = -1*vatwidth;
			  }

			  if(this.position.y < 0+this.mass/2){
			    overiny = this.position.y-this.mass/2;
			    vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
			    this.velocity.y = 1*vatheight;
			    this.position.y = 0+this.mass/2;
			  }

			  if(this.position.y > height-this.mass/2){
			    overiny = this.position.y-height+this.mass/2;
			    vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
			    this.position.y = height-this.mass/2;
			    this.velocity.y = -1*vatheight;
			  }	
			 // End bounceEdges


	   		// Recalculate position then velocity 
	   		this.acceleration = p5.Vector.add(createVector(0,0),globalAcc);
			this.velocity = p5.Vector.add(this.velocity,this.acceleration);
			this.position = p5.Vector.add(this.position,this.velocity);
			this.momentum = p5.Vector.add(this.velocity,this.mass);
			this.kineticEnergy = 0.5 * this.mass * (Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2));
			
			// Draw force arrow
			this.appliedForce = p5.Vector.mult(this.acceleration,this.mass);
			this.forceArrow.origin = this.position;
			this.forceArrow.target = p5.Vector.add(this.position,this.appliedForce);
			this.forceArrow.display();


			// Redraw
			push();
			fill(this.color);
			ellipse(this.position.x,this.position.y,this.mass,this.mass);
			pop();

	}; // end update method
}// End FreeBodyMover object


function setup(){
	frameRate(60);
	currentFrameRate = frameRate();
	createCanvas(windowWidth,windowHeight);
	balls = [];
	globalAcc = createVector(0,0);
	started = false;
	currentTime = millis();
	randColor = color(random(0,255),random(0,255),random(0,255),random(100,200));
}


function draw(){
	background(255);

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
		textSize(38);
		fill(25);
		text('Disable screen rotation',width/2,(height/2)-20);
		text('Tap or swipe to launch',width/2,(height/2)+20);
		pop();
	}

	// Recalculate acceleration based on device rotation
	globalAcc.x = map(constrain(rotationY,-45,45),-45,45,-2,2);
	globalAcc.y = map(constrain(rotationX,-45,45),-45,45,-2,2);


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
	if(balls.length > 9){
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
	balls[balls.length] = new FreeBodyMover(createVector(mouseX,mouseY),createVector(newVelocity.x,newVelocity.y),createVector(globalAcc.x,globalAcc.y),map(interval,0,1000,25,150),randColor);
	randColor = color(random(0,255),random(0,255),random(0,255),random(100,200));
}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}