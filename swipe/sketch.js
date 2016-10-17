/* A 2D Collision Simulator in p5.js
   @author Blake Rayvid <https://github.com/brayvid>
   @author CCNY Science Sims <http://sciencesims.com>
   @version 10.16.2016	*/

var spheres;

var globalAccel;
var collisionCount;
var dissipation;
var maxSpheres;

var fps;
var started;
var globalAccelOn;
var collisionsOn;
var deviceHasMoved = false;
var stopAll;

var beginDist;
var endDist;
var beginTime;
var endTime;
var newVelocity;
var currentTime;
var touchTime;

var randColor;

function Sphere(p, v, a, m, c){

	// Properties
	this.position = p;
	this.velocity = v;
	this.acceleration = a;
	this.mass = m;
	this.color = c;
	this.forceArrow = new Arrow(this.position,p5.Vector.add(this.position,this.appliedForce));
	this.forceArrow.color = color(0);
	this.forceArrow.grab = false;
	this.forceArrow.draggable = false;
	this.forceArrow.width = 10;

	this.velocityArrow = new Arrow(this.position,p5.Vector.add(this.position,p5.Vector.mult(this.velocity,16)));
	this.velocityArrow.color = this.color;
	this.velocityArrow.grab = false;
	this.velocityArrow.draggable = false;
	this.velocityArrow.width = 10;
	
	this.momentum = p5.Vector.add(this.velocity,this.mass);
	this.kineticEnergy = 0.5 * this.mass * (Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2));

	this.actingForces = [];

	// Methods
	this.act = function(force){
		// add a force to the array of acting forces
		this.actingForces.push(force);
	};

	// 
	this.refresh = function(){
		  
			// Window edge detection by http://github.com/hedbergj	(adadpted from the science.js library)
			if(this.position.x < 0+this.mass/2){
				overinx = this.position.x-this.mass/2;
				vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
				this.velocity.x = dissipation*vatwidth;
				this.position.x = 0+this.mass/2; 
			}

			if(this.position.x > width-this.mass/2){
				overinx = this.position.x-width+this.mass/2;
				vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
				this.position.x = width-this.mass/2;
				this.velocity.x = -dissipation*vatwidth; // Dissipation
			}

			if(this.position.y < 0+this.mass/2){
				overiny = this.position.y-this.mass/2;
				vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
				this.velocity.y = dissipation*vatheight; // Dissipation
				this.position.y = 0+this.mass/2;
			}

			if(this.position.y > height-this.mass/2){
				overiny = this.position.y-height+this.mass/2;
				vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
				this.position.y = height-this.mass/2;
				this.velocity.y = -dissipation*vatheight; // Dissipation
			}	// End edge detection


	   		// Recalculate position then velocity 
	   		this.acceleration = p5.Vector.add(createVector(0,0),globalAccel);
			this.velocity = p5.Vector.add(this.velocity,this.acceleration);
			this.position = p5.Vector.add(this.position,this.velocity);
			this.kineticEnergy = 0.5 * this.mass * (Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2));
			this.momentum = p5.Vector.mult(this.velocity,this.mass);
			
			// Draw force arrow
			this.appliedForce = p5.Vector.mult(this.acceleration,this.mass);
			this.forceArrow.origin = this.position;
			this.forceArrow.target = p5.Vector.add(this.position,p5.Vector.mult(this.appliedForce,0.35));
			this.forceArrow.display();

			// Draw velocity arrow
			this.velocityArrow.origin = this.position;
			this.velocityArrow.target.x = this.position.x + map(this.velocity.x,-200,200,-150,150);
			this.velocityArrow.target.y = this.position.y + map(this.velocity.y,-200,200,-150,150);
			this.velocityArrow.display();

			// Redraw
			push();
			fill(this.color);
			ellipse(this.position.x,this.position.y,this.mass,this.mass);
			pop();
	};


	// Sphere checks itself against one passed to it
	this.intersects = function(other){
		var d = dist(this.position.x,this.position.y,other.position.x,other.position.y);
		if(d < (this.mass/2) + (other.mass/2)){
			return true;
		}else{
			return false;
		}
	};

	// Used upon collision
	this.newColor = function(other){
		var r, g, b, a;
		// Sphere with greater momentum spreads color
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
	};

	// New methods here:



}// End object definition


function setup(){
	frameRate(60);
	fps = frameRate();
	createCanvas(windowWidth,windowHeight);
	spheres = [];
	globalAccel = createVector(0,20);
	globalAccelOn = true;
	collisionsOn = true;
	dissipation = 0.88;
	started = false;
	currentTime = millis();
	setMoveThreshold(0.001);
	collisionCount = 0;
	stopAll = false;
	maxSpheres = 50;

	for(var i = 0; i < 5; i++){
		spheres[i] = new Sphere(
					createVector(random(0,width),random(0,height)),
					createVector(random(0,25),random(0,25)),
					createVector(random(-1,1),random(-1,1)),
					random(0,75),
					color(random(0,255),random(0,255),random(0,255),random(100,200)));
	}
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
		fps = round(frameRate());
	}
	text(fps + ' fps',60, height-25);
	pop();
	
	// Display total kinetic energy
	push();
	textSize(24);
	textAlign(CENTER);
	var totalKE = 0;
	for(var i = 0; i < spheres.length; i++){
		totalKE += spheres[i].kineticEnergy;
	}
	text('KE:',width-75,height-45);
	text(round(totalKE) + ' J',width-75,height-20);
	pop();

	// What to do before any user interaction
	if(!started){
		push();
		textAlign(CENTER);
		textSize(width/15);
		fill(25);

		// Check if on mobile or desktop
		if(deviceHasMoved){
			push();
			textSize(width/20);
			text('Lock your screen rotation',width/2,(height/2)-40);
			pop();

			// Gravity on/off switch
			// pop();
			// push();
			// rectMode(CORNER);
			// fill(0,230,0);
			// rect(25,height-550,width/2-30,150);
			// fill(230,0,0);
			// rect(width/2+30,height-550,width/2-60,150);
			// pop();

			// push();
			// fill(255);
			// textSize(60);
			// noStroke();
			// textAlign(CENTER);
			// text('GRAVITY ON',(35+(width/2-30))/2, height-450);
			// text('GRAVITY OFF',((width/2+30)+(width/2-60)/2), height-450);

		}else{
			push();
			textSize(width/25);
			fill(225,0,75,125);
			text('Gravity off - needs accelerometers.',width/2,(height/2)-70);
			pop();
		}
		// Displayed on both types of devices
		text('Tap or drag to begin',width/2,(height/2)+30);
		
	}else{
		push();
		textSize(24);
		textAlign(CENTER);

		text(spheres.length + "/" + maxSpheres,width-50,50);
		pop();
	}

	// Only calculate if enabled
	if(globalAccelOn){
		//Get acceleration from device rotation data
		globalAccel.x = map(constrain(rotationY,-45,45),-45,45,-2,2);
		globalAccel.y = map(constrain(rotationX,-45,45),-45,45,-2,2);
	}

	// Only check if enabled
	if(collisionsOn){

		for(var i = 0; i < spheres.length; i++){
			for(var j = 0; j < spheres.length; j++){

				// Spheres perform the check themselves
				if(i != j && spheres[i].intersects(spheres[j])){

					// Old
					// var heading1 = degrees(spheres[i].velocity.heading());
					// var heading2 = degrees(spheres[j].velocity.heading());
					// console.log(spheres[i] + ' intersects ' + spheres[j]);
					// console.log('heading 1: '+ heading1 + ', heading 2: '+ heading2);
					// console.log(collisionPoint.x + ", "+ collisionPoint.y);

					// // Draw collision points
					// push();
					// fill(255,0,0);
					// var r = map(collisionMomentum,0,1,0,50);
					// ellipse(collisionPoint.x,collisionPoint.y,r,r);
					// pop();

					// COLLISION PHYSICS
					// Calculate resultant velocities
					var newVelX1 = (spheres[i].velocity.x * (spheres[i].mass - spheres[j].mass) + (2 * spheres[j].mass * spheres[j].velocity.x)) / (spheres[i].mass + spheres[j].mass);
					var newVelY1 = (spheres[i].velocity.y * (spheres[i].mass - spheres[j].mass) + (2 * spheres[j].mass * spheres[j].velocity.y)) / (spheres[i].mass + spheres[j].mass);
					var newVelX2 = (spheres[j].velocity.x * (spheres[j].mass - spheres[i].mass) + (2 * spheres[i].mass * spheres[i].velocity.x)) / (spheres[i].mass + spheres[j].mass);
					var newVelY2 = (spheres[j].velocity.y * (spheres[j].mass - spheres[i].mass) + (2 * spheres[i].mass * spheres[i].velocity.y)) / (spheres[i].mass + spheres[j].mass);

					// Update positions to prevent sticking
					spheres[i].position.x = spheres[i].position.x + newVelX1;
					spheres[j].position.x = spheres[j].position.x + newVelX2;
					spheres[i].position.y = spheres[i].position.y + newVelY1;
					spheres[j].position.y = spheres[j].position.y + newVelY2;

					// Update velocities with calculated ones
					spheres[i].velocity.set(newVelX1,newVelY1);
					spheres[j].velocity.set(newVelX2,newVelY2);



					var collisionPoint = createVector(
						// X
						((spheres[i].position.x * spheres[j].mass/2) + (spheres[j].position.x * spheres[i].mass/2)) 
					 	/ (spheres[i].mass/2 + spheres[j].mass/2),
					 	// Y
					 	((spheres[i].position.y * spheres[j].mass/2) + (spheres[j].position.y * spheres[i].mass/2)) 
					 	/ (spheres[i].mass/2 + spheres[j].mass/2)
					);

					var collisionMomentum = p5.Vector.add(spheres[i].momentum,spheres[j].momentum);


					spheres[i].newColor(spheres[j]);

					// Increment count
					collisionCount++;


					// console.log('collisions: ' + collisionCount);

					// // var angle = p5.Vector.angleBetween(spheres[i].velocity,spheres[j].velocity);

					// // Finish collision math
					
					// // console.log(180*angle/PI);
				}
			}
		}
	} // end collisions section

	// Account for device rotation -- incomplete
	// if(false){
	// 	if(deviceOrientation == 'portrait' && rotationX > 0){ // normal phone orientation
	// 		globalAccel.x = map(constrain(rotationY,-50,50),-50,50,-0.8,0.8);
	// 		globalAccel.y = map(constrain(rotationX,-50,50),-50,50,-0.8,0.8);

	// 	}else if(rotationX < 0){ // Upside down portrait
	// 		globalAccel.x = map(constrain(rotationY,-50,50),-50, 50,0.8,-0.8);
	// 		globalAccel.y = map(constrain(rotationX,-50,50),-50, 50,0.8,-0.8); // flip signs

	// 	}else if(deviceOrientation == 'landscape' && rotationY > 0){  // Clockwise landscape
	// 		globalAccel.x = map(constrain(rotationX,-50,50),-50,50,0.8,-0.8); 
	// 		globalAccel.y = map(constrain(rotationY,-50,50),-50,50,-0.8,0.8);

	// 	}else if(rotationY < 0){ // Counterclockwise landscape
	// 		globalAccel.x = map(constrain(rotationX,-50,50),-50,50,0.8,-0.8);
	// 		globalAccel.y = map(constrain(rotationY,-50,50),50,-50,-0.8,0.8);
	// 	}else{

	// 	}
	// }

	// if(deviceOrientation == 'landscape' && rotationY < 0){
	// globalAccel.x = map(constrain(rotationX,-50,50),-50,50,-0.2,0.2);
	// globalAccel.y = map(constrain(rotationY,-50,50),-50,50,-0.2,0.2);
	// }

	// if(deviceOrientation == 'landscape' && rotationY > 0){
	// globalAccel.x = map(constrain(rotationY,-50,50),-50,50,0.2,-0.2);
	// globalAccel.y = map(constrain(rotationX,-50,50),-50,50,-0.2,0.2);
	// }


	// Only update if not paused
	if(!stopAll){
		for(var i = 0; i < spheres.length; i++){
			spheres[i].refresh();
		}
	}

	// Pause screen
	if(stopAll){
		push();
		textAlign(CENTER);
		textSize(80);
		fill(0,0,0,90);
		text('paused',width/2,height/2);
		pop();
	}

	// Limit # of spheres
	if(spheres.length > maxSpheres){
		spheres.splice(0,26);
	}


	// console.log('x: ' + rotationX +',y: '+rotationY);

	// if(spheres.length > 0){
	// 	console.log(spheres[0].acceleration);
	// }
}

function touchStarted(){

	// User selects gravity on/off initially
	// if(touchX < width/2 - 30 && touchY < 400 && !started){
	// 	globalAccelOn = false;
	// 	globalAccel = createVector(0,0);
	// }else if(touchX > width/2 + 30 && touchY < 200 && !started){
	// 	globalAccelOn = true;
	// 	globalAccel.x = map(constrain(rotationY,-45,45),-45,45,-2,2);
	// 	globalAccel.y = map(constrain(rotationX,-45,45),-45,45,-2,2);
	// }

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

	// MAKE A NEW SPHERE
	randColor = color(floor(random(0,255)),floor(random(0,256)),floor(random(0,256)),floor(random(100,200)));
	spheres[spheres.length] = new Sphere(createVector(mouseX,mouseY),createVector(newVelocity.x,newVelocity.y),createVector(globalAccel.x,globalAccel.y),map(interval,0,200,25,125),randColor);
	console.log("Speed = " + p5.Vector.mag(newVelocity).toFixed(2)+" pixels per frame");
}


function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}

// Is device mobile or desktop
function deviceMoved(){
	deviceHasMoved = true;
}

// Pause functionality
function keyTyped(){
	if(keyCode == 32 && !stopAll){
		stopAll = true;
	}else if(keyCode == 32 && stopAll){
		stopAll = false;
	}
}


