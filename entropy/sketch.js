var spheres = [];	// Primary object storage

var gasBox;

var initialSpheres;
var maxSpheres;

var globalAccel;
var globalAccelOn;
var wallDissipation;
var collisionDissipation;

var collisionsOn;
var collisionCount;
var totalKE;
var totalP;

var avgSpeed;


var started;
var stopAll;
var deviceHasMoved = false;
var wasPaused = false;
// var tempIsSet = false;
var invalidSize;
var sphereCreated;
var touchEndedCount = 0;

var fps;

var beginDist;	//  when touch started
var beginTime;	//	when touch started
var endTime;	// when touch stops
var currentTime;	//	to update fps slower than normal rate

var netMomentumArrow;

var pausedSpheres;

var dataFontSize;

function setup(){
	createCanvas(windowWidth,windowHeight);
	frameRate(60);
	setMoveThreshold(0.001);
	textStyle(BOLD);
	textAlign(CENTER);

	fps = frameRate();
	initialSpheres = 1;
	globalAccelOn = false;
	globalAccel = createVector(0,0);
	collisionsOn = true;
	wallDissipation = 1;
	collisionDissipation = 1;

	started = false;
	// currentTime = millis();
	collisionCount = 0;
	stopAll = false;
	maxSpheres = 100;
	pausedSpheres = [];
	totalKE = 0;
	totalP = createVector(0,0);
	avgSpeed = 0;
	invalidSize = true;
	sphereCreated = false;

	dataFontSize = (width+height)/80;

	netMomentumArrow = new Arrow(createVector(3*width/4-100,120),p5.Vector.add(createVector(3*width/4-100,120),totalP));
	netMomentumArrow.draggable = false;
	netMomentumArrow.grab = false;
	netMomentumArrow.color = color(0,0,0,255);
	netMomentumArrow.width = 20;

	gasBox = new Box(100,createVector(0,0));

	for(var i = 0; i < initialSpheres; i++){
		spheres[i] = new Sphere(
					createVector(random(gasBox.leftX + 20,gasBox.rightX - 20),random(gasBox.topY + 20,gasBox.bottomY - 20)),  // position
					createVector(random(-10,10),random(-10,10)), // velocity
					createVector(random(-1,1),random(-1,1)), // acceleration
					random(20,20),	// mass
					color(random(0,255),random(0,255),random(0,255),random(25,75))); // color
	}
}

// Modified mover object in science.js
function Sphere(p, v, a, m, c){

	// Properties
	this.position = p;
	this.velocity = v;
	this.acceleration = a;
	this.mass = m;
	this.color = c;

	this.momentum = p5.Vector.mult(this.velocity,this.mass);
	this.kineticEnergy = 0.5 * this.mass * Math.pow(p5.Vector.mag(this.velocity),2);

	this.forceArrow = new Arrow(this.position,p5.Vector.add(this.position,this.appliedForce));
	this.forceArrow.color = color(0);
	this.forceArrow.grab = false;
	this.forceArrow.draggable = false;
	this.forceArrow.width = 10;

	this.momentumArrow = new Arrow(this.position,p5.Vector.add(this.position,this.momentum));
	this.momentumArrow.color = color(0,0,0,255);
	this.momentumArrow.grab = false;
	this.momentumArrow.draggable = false;
	this.momentumArrow.width = 10;

	// this.actingForces = []; 

	// Methods

	// this.act = function(force){
	// 	// add a force to the array of acting forces
	// 	this.actingForces.push(force);
	// };

	// 
	this.refresh = function(){

			// Window edge detection by http://github.com/hedbergj	(adadpted from the science.js library)
			if(this.position.x < gasBox.leftX+this.mass/2){
				overinx = this.position.x + gasBox.leftX -this.mass/2;
				vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
				this.velocity.x = wallDissipation*vatwidth;
				this.position.x = gasBox.leftX+this.mass/2; 
			}

			if(this.position.x > gasBox.rightX-this.mass/2){
				overinx = this.position.x-gasBox.rightX+this.mass/2;
				vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
				this.position.x = gasBox.rightX-this.mass/2;
				this.velocity.x = -wallDissipation*vatwidth;
			}

			if(this.position.y < gasBox.topY+this.mass/2){
				overiny = this.position.y + gasBox.topY -this.mass/2;
				vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
				this.velocity.y = wallDissipation*vatheight;
				this.position.y = gasBox.topY+this.mass/2;
			}

			if(this.position.y > gasBox.bottomY-this.mass/2){
				overiny = this.position.y-gasBox.bottomY +this.mass/2;
				vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
				this.position.y = gasBox.bottomY-this.mass/2;
				this.velocity.y = -wallDissipation*vatheight;
			}	// End edge detection


	   		// Recalculate variables 
	   		this.acceleration = p5.Vector.add(createVector(0,0),globalAccel);
			var tempVelocity = p5.Vector.add(this.velocity,this.acceleration);
			this.velocity.x = (tempVelocity.x + this.velocity.x) / 2;
			this.velocity.y = (tempVelocity.y + this.velocity.y) / 2;
			this.position = p5.Vector.add(this.position,this.velocity);
			this.kineticEnergy = 0.5 * this.mass * (Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2));
			this.momentum = p5.Vector.mult(this.velocity,this.mass);
			
			// net force arrow - not implemented
			// this.appliedForce = p5.Vector.mult(this.acceleration,this.mass);
			// this.forceArrow.origin = this.position;
			// this.forceArrow.target = p5.Vector.add(this.position,p5.Vector.mult(this.appliedForce,0.35));
			// this.forceArrow.display();

			// momentum arrow
			this.momentumArrow.origin = this.position;
			this.momentumArrow.target.x = this.position.x + map(this.momentum.x,-10000,10000,-500,500);
			this.momentumArrow.target.y = this.position.y + map(this.momentum.y,-10000,10000,-500,500);
			

			// Shadows
			// var dFromCenter = p5.Vector.sub(createVector(width/2,height/2),this.position);
			// push();
			// fill(0,0,0,35);
			// noStroke();
			// ellipse(this.position.x+map(dFromCenter.x*log(this.mass),-4000,4000,-15,15),this.position.y+map(dFromCenter.y*log(this.mass),-4000,4000,-15,15),this.mass-0.1*this.mass,this.mass-0.14*this.mass); // Shadow
			// pop();

			// Draw a ball
			push();
			fill(this.color);
			stroke(0);
			// noStroke();
			ellipse(this.position.x,this.position.y,this.mass,this.mass); // sphere
			pop();

			this.momentumArrow.display();
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
			this.momentumArrow.color = color(0,0,0,255);
		}else{
			var r = map(this.color._array[0],0,1,0,255);
			var g = map(this.color._array[1],0,1,0,255);
			var b = map(this.color._array[2],0,1,0,255);
			var a = map(this.color._array[3],0,1,0,255);
			other.color = color(r,g,b,a);
			other.momentumArrow.color = color(0,0,0,255);
		}
	};

}// End object definition

function Box(m, v){
	this.position = createVector(width/2,height/2); // p5 Vector
	this.length = width/2;	// number	
	this.height = height/2;	// number
	this.mass = m;
	this.velocity = v;
	this.acceleration = createVector(0,0);
	this.color = color(0,0,0,0); // Transparent
	this.borderColor = color(0,0,0); // black
	this.leftX;
	this.rightX;
	this.topY;
	this.bottomY;

	this.update = function(){
		this.leftX = this.position.x - this.length/2;
		this.rightX = this.position.x + this.length/2;
		this.topY = this.position.y - this.height/2;
		this.bottomY = this.position.y + this.height/2;
	}
	this.display = function(){

		this.position.add(this.velocity);
		push();	
		fill(this.color);
		stroke(this.borderColor);
		rectMode(CENTER);
		rect(this.position.x,this.position.y,this.length,this.height);
		pop();
	}

	this.checkEdges = function(){
		// Window edge detection by http://github.com/hedbergj	(adadpted from the science.js library)
		if(this.leftX < 0){
			overinx = this.position.x;
			vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
			this.velocity.x = wallDissipation*vatwidth;
			// this.position.x = this.width/2; 
		}

		if(this.rightX > width){
			overinx = this.position.x-width;
			vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
			// this.position.x = width-this.width/2;
			this.velocity.x = -wallDissipation*vatwidth;
		}

		if(this.topY < 0){
			overiny = this.position.y;
			vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
			this.velocity.y = wallDissipation*vatheight;
			// this.position.y = this.height/2;
		}

		if(this.bottomY > height){
			overiny = this.position.y-height;
			vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
			// this.position.y = height-this.height/2;
			this.velocity.y = -wallDissipation*vatheight;
		}	// End edge detection
	}

	this.act = function(force){

	}

	this.resized = function(){
		this.position.set(width/2,height/2);
		this.length = width/2;
		this.height = height/2;
	}
}

function draw(){
		/* 	Two variables, "started" and "stopAll", control the primary flow of draw().
		--	"started" is false to start and is true after first touch
		-- 	"stopAll" is false to start and is flipped when spacebar is typed 	*/


		// // Intro screen
		// if(!started && !stopAll){
		// 	push();
		// 	textAlign(CENTER);
		// 	textSize(width/15);
		// 	fill(25);

		// 	// Check if on mobile or desktop
		// 	if(deviceHasMoved){
		// 		push();
		// 		textSize(width/20);
		// 		text('Lock your screen rotation',width/2,(height/2)-60);
		// 		pop();

		// 		// Gravity on/off switch
		// 		// pop();
		// 		// push();
		// 		// rectMode(CORNER);
		// 		// fill(0,230,0);
		// 		// rect(25,height-550,width/2-30,150);
		// 		// fill(230,0,0);
		// 		// rect(width/2+30,height-550,width/2-60,150);
		// 		// pop();

		// 		// push();
		// 		// fill(255);
		// 		// textSize(60);
		// 		// noStroke();
		// 		// textAlign(CENTER);
		// 		// text('GRAVITY ON',(35+(width/2-30))/2, height-450);
		// 		// text('GRAVITY OFF',((width/2+30)+(width/2-60)/2), height-450);
		// 	}

		// 	// else{
		// 	// 	push();
		// 	// 	textSize(width/25);
		// 	// 	fill(225,0,75,125);
		// 	// 	text('Gravity disabled - needs an accelerometer.',width/2,(height/2)-70);
		// 	// 	pop();
		// 	// }
		// 	// Displayed on both types of devices
		// text('Tap or drag anywhere',width/2,(height/2)+10);
			
		// }

		// Pause screen
		if(false){
			// // If not paused
			// if(!tempIsSet){

			// 	// Store current spheres in temp array
			// 	for(var i = 0; i < spheres.length; i++){
			// 		pausedSpheres[i] = spheres[i];
			// 	}
			// 	tempIsSet = true;
			// 	// Do not repeat this code
			// }
			// push();
			// textAlign(CENTER);
			// textSize(80);
			// fill(0,0,0,90);
			// text('paused',width/2,height/2);
			// pop();

		}else{
		// Normal operations
			background(255);

			// Intro screen
			// if(!started){	
			// 	displayIntroScreen();	
			// }

			// Limit # of spheres by removing oldest one
			if(spheres.length > maxSpheres){
				spheres.splice(0,1);
			}

			// Unused
			// tempIsSet = false;

			//Get acceleration from device rotation data
			if(globalAccelOn && !stopAll){
				globalAccel.x = map(constrain(rotationY,-45,45),-45,45,-2,2);
				globalAccel.y = map(constrain(rotationX,-45,45),-45,45,-2,2);
			}

			// Main update
			for(var i = 0; i < spheres.length; i++){
				spheres[i].refresh();
			}
			
			gasBox.update();
			gasBox.checkEdges();
			gasBox.display();


			// Only check if enabled
			if(collisionsOn){
				checkForCollisions();
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


			// console.log('x: ' + rotationX +',y: '+rotationY);

			// if(spheres.length > 0){
			// 	console.log(spheres[0].acceleration);
			// }

						// Recalculate total kinetic energy
			totalKE = 0;
			if(spheres.length == 0){
				// Just stay at 0
			}else{
				for(var i = 0; i < spheres.length; i++){
				totalKE += spheres[i].kineticEnergy;
				}
			}

			avgSpeed = 0;
			if(spheres.length == 0){
				// Just stay at 0
			}else{
				var totalSpeed = 0;
				for(var i = 0; i < spheres.length; i++){
				 totalSpeed += spheres[i].velocity.mag();
				}

				// console.log(totalSpeed);
				avgSpeed = totalSpeed / spheres.length;
				// console.log(avgSpeed);
			}

			// Recalculate net momentum
			totalP.set(0,0);
			for(var i = 0; i < spheres.length; i++){
				// totalP = p5.Vector.add(totalP,spheres[i].momentum);
				totalP.x += spheres[i].momentum.x;
				totalP.y += spheres[i].momentum.y;
			}

			// Get time for intervals
			currentTime = millis();


			// On-screen data

			displayFrameRate();
			

			// push();
			// fill(0);
			// textSize(dataFontSize);
			// textAlign(CENTER);
			// text('Kinetic energy',width/4+50,50);
			// if(totalKE == 0){
			// 	text(totalKE.toFixed(1) + ' J',width/4+50,95);
			// }else if(totalKE > 0 && totalKE < 1000){
			// 	// console.log(totalKE);
			// 	text(totalKE.toFixed(1) + ' mJ',width/4+50,95);
			// }else if(totalKE >= 1000 && totalKE < 1000000){	
			// 	text((totalKE/1000).toFixed(1) + ' J',width/4+50,95);
			// }else if(totalKE >= 1000000 && totalKE < 1000000000){
			// 	text((totalKE/1000000).toFixed(1) + ' KJ',width/4+50,95);
			// }else{
			// 	text((totalKE/1000000000).toFixed(1) + ' MJ',width/4+50,95);
			// }
			// pop();

			// displayAverageParticleSpeed();

			// displaySphereCount();
		}

		// console.log('deviceHasmoved == '+deviceHasMoved);
		// push();
		// fill(randColor);
		// ellipse(mouseX,mouseY,50,50);
		// pop();

}// end draw

// Fires immediately upon user touch
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
		started = true;
	}
	// Start measuring for initial velocity
	
	beginDist = createVector(mouseX,mouseY);
	beginTime = millis();

	touchEndedCount = 0;
}

// Fires only when touch is released after being pressed
function touchEnded(){
		// Only do this once per touch (in case touchEnded is called multiple times for the same event)
		if(touchEndedCount == 0){
			touchEndedCount++;
			launchNewSphere();
		}
}

// Checks if location is valid for a new sphere
function launchNewSphere(){

	sphereCreated = false;
	invalidSize = true;
	var attemptToFix = true;

	endTime = millis();
	var interval = endTime - beginTime;

	// New sphere parameters
	var newPosition = createVector(mouseX, mouseY);
	var newVelocity = p5.Vector.div(p5.Vector.mult(p5.Vector.sub(newPosition,beginDist),4),map(interval,0,1000,0,1500)/4);
	var newAcceleration = globalAccel;
	var newMass = constrain(map(interval,0,500,25,125),25,25); // This may get reduced
	var randColor = color(floor(random(0,255)),floor(random(0,256)),floor(random(0,256)),floor(random(100,200)));
	// console.log(newMass);

	var count = 0;
	do{
		
		var d = 0;
		// var ok = [];
		var inTheWay = 0;

		/*	Check the distance to each sphere. If the distance from the mouse to 
			the sphere is greater than the sum of the new radius and the radius of the 
			sphere being checked, mark its index as ok. If any index is not ok, reduce
			new mass until distance is ok. 	*/

		for(var i = 0; i < spheres.length; i++){

			d = dist(newPosition.x,newPosition.y,spheres[i].position.x,spheres[i].position.y);

			if (d > spheres[i].mass/2 + newMass/2 && d > spheres[i].mass/2) {
				// ok[i] = true;	
			}else{
				// ok[i] = false;
				inTheWay++;
				// console.log('in the way');
			}

			// See if every element of ok is true. If they are, let allOk remain true
			// for(var i = 0; i < ok.length; i++){
			// 	if(ok[i] == false){
			// 		inTheWay++;
			// 	}
			// }
		}

		// console.log(inTheWay + ' overlapping');

		if(inTheWay == 0 && !sphereCreated && attemptToFix){
		// All checks have been passed

			//Create a new sphere
			spheres[spheres.length] = new Sphere(newPosition,newVelocity,newAcceleration,newMass,randColor);
			// Report new 
			var launchKE = (Math.pow(p5.Vector.mag(newVelocity),2) * newMass * 0.5);
			// console.log(round(launchKE/1000)  +" J added");

			sphereCreated = true;
			// Break out of loop once one sphere has been created
			invalidSize = false;
			attemptToFix = false;
		}else{
			// Try again with a smaller radius
			if(newMass > 25){
				newMass -= 3;
			}else{
				attemptToFix = false;
			}
		} 
		count++; // count iterations of the do-while to ensure no infinite looping
	}while(invalidSize && !sphereCreated && attemptToFix && count<50);
	// console.log(touchEndedCount);		
}

// Collision detection & arbitration 
function checkForCollisions(){
	
	// Sphere-sphere interactions
	for(var i = 0; i < spheres.length; i++){
		for(var j = 0; j < spheres.length; j++){

			// Spheres perform the check themselves
			if(i != j && spheres[i].intersects(spheres[j])){

				// console.log(spheres[i] + ' intersects ' + spheres[j]);

				// var heading1 = degrees(spheres[i].velocity.heading());
				// var heading2 = degrees(spheres[j].velocity.heading());

				// console.log('heading 1: '+ heading1 + ', heading 2: '+ heading2);

				// var collisionPoint = createVector(
				// 	//	X
				// 		((spheres[i].position.x * spheres[j].mass/2) + (spheres[j].position.x * spheres[i].mass/2)) 
				// 		/ (spheres[i].mass/2 + spheres[j].mass/2),
				// 	//	Y
				// 		((spheres[i].position.y * spheres[j].mass/2) + (spheres[j].position.y * spheres[i].mass/2)) 
				//  		/ (spheres[i].mass/2 + spheres[j].mass/2)
				// );

				// console.log(collisionPoint.x + ", "+ collisionPoint.y);

				// Calculate resultant velocities
				var newVelX1 = collisionDissipation*((spheres[i].velocity.x * (spheres[i].mass - spheres[j].mass) + (2 * spheres[j].mass * spheres[j].velocity.x)) / (spheres[i].mass + spheres[j].mass));
				var newVelY1 = collisionDissipation*((spheres[i].velocity.y * (spheres[i].mass - spheres[j].mass) + (2 * spheres[j].mass * spheres[j].velocity.y)) / (spheres[i].mass + spheres[j].mass));
				var newVelX2 = collisionDissipation*((spheres[j].velocity.x * (spheres[j].mass - spheres[i].mass) + (2 * spheres[i].mass * spheres[i].velocity.x)) / (spheres[i].mass + spheres[j].mass));
				var newVelY2 = collisionDissipation*((spheres[j].velocity.y * (spheres[j].mass - spheres[i].mass) + (2 * spheres[i].mass * spheres[i].velocity.y)) / (spheres[i].mass + spheres[j].mass));

				// Update positions to prevent sticking
				spheres[i].position.x = spheres[i].position.x + newVelX1;
				spheres[j].position.x = spheres[j].position.x + newVelX2;
				spheres[i].position.y = spheres[i].position.y + newVelY1;
				spheres[j].position.y = spheres[j].position.y + newVelY2;
				
				// Update velocities with calculated ones
				spheres[i].velocity.set(newVelX1,newVelY1);
				spheres[j].velocity.set(newVelX2,newVelY2);

				// // Draw collision points
				// push();
				// fill(255,0,0);
				// var r = map(collisionMomentum,0,1,0,50);
				// ellipse(collisionPoint.x,collisionPoint.y,r,r);
				// pop();

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
}

// Slow-motion
function keyPressed(){

	//  flip stopAll on and off
	if(keyCode == 32 && !stopAll){
		stopAll = true;
		frameRate(16);
	}else if(keyCode == 32 && stopAll){
		stopAll = false;
		frameRate(60);
	}

}

// Update canvas size to fill window 
function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
	gasBox.resized();
}

// Check is device mobile
function deviceMoved(){
	deviceHasMoved = true;
}

function displayIntroScreen(){
	push();
	textSize(48);
	text('Tap or drag anywhere',width/2,(height/2)+10);
	pop();

	push();
	textSize(34);
	if(Math.abs(wallDissipation - 1.0) < 0.001 && Math.abs(collisionDissipation - 1.0) < 0.001){
		text('Dissipation OFF', width/2, (height/2)+200);
	}else{
		text('Dissipation ON', width/2, (height/2)+200);
	}
	pop();

	push();
	textSize(34);
	if(globalAccelOn){
		text('Gravity ON', width/2, (height/2)+250);
	}else{
		text('Gravity OFF', width/2, (height/2)+250);
	}
	pop();

	push();
	textSize(34);
	if(collisionsOn){
		text('Collisions ON', width/2, (height/2)+300);
	}else{
		text('Collisions OFF', width/2, (height/2)+300);
	}
	pop();
}

function displayAverageParticleSpeed(){
	push();
	textSize(24);
	text('Avg. particle speed',width/8,height/2);
	text(avgSpeed.toFixed(2),width/8,height/2+50);
	pop();
}

function displayNetMomentum(){
	push();
	fill(0);
	textSize(dataFontSize);
	textAlign(CENTER);
	text('Net momentum',3*width/4-50,48);
	if(totalP.mag() == 0){
		text((totalP.mag()/60).toFixed(1) + ' g cm/s',3*width/4-50,95);
	}else{
		text((totalP.mag()/60).toFixed(1) + ' g cm/s',3*width/4-75,95);
	}
	netMomentumArrow.origin = p5.Vector.sub(createVector(3*width/4+60,85),totalP.normalize().mult(20));
	netMomentumArrow.target = p5.Vector.add(createVector(3*width/4+60,85),totalP.normalize().mult(20));
	if(totalP.mag() != 0){
		netMomentumArrow.display();
	}

}

function displayFrameRate(){
	push();
	textSize(dataFontSize);
	if(round(currentTime) % 10 == 0){
		fps = round(frameRate());
	}
	text(fps + ' fps',70, height-35);
	pop();
}

function displaySphereCount(){
	// Display number of spheres created
	push();
	textSize(dataFontSize);
	textAlign(CENTER);
	text(spheres.length + "/" + maxSpheres,width-70,height-35);
	pop();
}