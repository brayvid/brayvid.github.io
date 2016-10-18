/* 2D Particle Collision Simulator in p5.js
   @author Blake Rayvid <https://github.com/brayvid>
   @author CCNY Science Sims <http://sciencesims.com>
   @version 10.16.2016	*/

var spheres;

var globalAccel;
var collisionCount;
var wallDissipation;
var collisionDissipation;
var maxSpheres;

var fps;
var started;
var globalAccelOn;
var collisionsOn;
var deviceHasMoved = false;
var stopAll;

var beginDist;
var beginTime;
var endTime;
var currentTime;

var initialSpheres;

var pausedSpheres;

var wasPaused = false;

var tempIsSet = false;

var totalKE;
var totalP;

var invalidSize;

var touchEndedCount = 0;

var invalidSize;
var sphereCreated;
var netMomentumArrow;
var dataFontSize;

function setup(){
	createCanvas(windowWidth,windowHeight);
	frameRate(60);
	fps = frameRate();
	spheres = [];

	initialSpheres = 1;
	// globalAccel = createVector(0,0);
	globalAccelOn = false;
	collisionsOn = true;
	wallDissipation = 0.995;
	collisionDissipation = 0.995;

	started = false;
	// currentTime = millis();
	setMoveThreshold(0.001);
	collisionCount = 0;
	stopAll = false;
	maxSpheres = 50;
	pausedSpheres = [];
	totalKE = 0;
	totalP = createVector(0,0);
	invalidSize = true;
	sphereCreated = false;

	dataFontSize = (width+height)/80;
	textStyle(BOLD);

	netMomentumArrow = new Arrow(createVector(3*width/4-100,120),p5.Vector.add(createVector(3*width/4-100,120),totalP));
	netMomentumArrow.draggable = false;
	netMomentumArrow.grab = false;
	netMomentumArrow.color = color(0,0,0,255);
	netMomentumArrow.width = 20;

	for(var i = 0; i < initialSpheres; i++){
		spheres[i] = new Sphere(
					createVector(random(width/4,3*width/4),random(height/4,3*height/4)),  // position
					createVector(random(-25,25),random(-25,25)), // velocity
					createVector(random(-1,1),random(-1,1)), // acceleration
					random(75,90),	// mass
					color(random(0,255),random(0,255),random(0,255),random(100,200))); // color
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
			if(this.position.x < 0+this.mass/2){
				overinx = this.position.x-this.mass/2;
				vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
				this.velocity.x = wallDissipation*vatwidth;
				this.position.x = 0+this.mass/2; 
			}

			if(this.position.x > width-this.mass/2){
				overinx = this.position.x-width+this.mass/2;
				vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);
				this.position.x = width-this.mass/2;
				this.velocity.x = -wallDissipation*vatwidth;
			}

			if(this.position.y < 0+this.mass/2){
				overiny = this.position.y-this.mass/2;
				vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
				this.velocity.y = wallDissipation*vatheight;
				this.position.y = 0+this.mass/2;
			}

			if(this.position.y > height-this.mass/2){
				overiny = this.position.y-height+this.mass/2;
				vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);
				this.position.y = height-this.mass/2;
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
			if(!started){
				push();
				textSize(48);
				text('Tap or drag anywhere',width/2,(height/2)+10);
				pop();
			}

			// Unused
			tempIsSet = false;


			// Recalculate total kinetic energy
			totalKE = 0;
			if(spheres.length == 0){
				// Just stay at 0
			}else{
				for(var i = 0; i < spheres.length; i++){
				totalKE += spheres[i].kineticEnergy;
				}
			}

			// Recalculate net momentum
			totalP.set(0,0);
			for(var i = 0; i < spheres.length; i++){
				totalP = p5.Vector.add(totalP,spheres[i].momentum);
			}

			//Get acceleration from device rotation data
			if(globalAccelOn && !stopAll){
				globalAccel.x = map(constrain(rotationY,-45,45),-45,45,-2,2);
				globalAccel.y = map(constrain(rotationX,-45,45),-45,45,-2,2);
			}

			// Main update
			for(var i = 0; i < spheres.length; i++){
				spheres[i].refresh();
			}

			// Limit # of spheres
			if(spheres.length > maxSpheres){
				spheres.splice(0,26);
			}

			// Only check if enabled
			if(collisionsOn){

					for(var i = 0; i < spheres.length; i++){
						for(var j = 0; j < spheres.length; j++){

							// Spheres perform the check themselves
							if(i != j && spheres[i].intersects(spheres[j])){

								// var heading1 = degrees(spheres[i].velocity.heading());
								// var heading2 = degrees(spheres[j].velocity.heading());
								// console.log(spheres[i] + ' intersects ' + spheres[j]);
								// console.log('heading 1: '+ heading1 + ', heading 2: '+ heading2);
								// console.log(collisionPoint.x + ", "+ collisionPoint.y);

								// Calculate resultant velocities
								var newVelX1 = collisionDissipation*((spheres[i].velocity.x * (spheres[i].mass - spheres[j].mass) + (2 * spheres[j].mass * spheres[j].velocity.x)) / (spheres[i].mass + spheres[j].mass));
								var newVelY1 = collisionDissipation*((spheres[i].velocity.y * (spheres[i].mass - spheres[j].mass) + (2 * spheres[j].mass * spheres[j].velocity.y)) / (spheres[i].mass + spheres[j].mass));
								var newVelX2 = collisionDissipation*((spheres[j].velocity.x * (spheres[j].mass - spheres[i].mass) + (2 * spheres[i].mass * spheres[i].velocity.x)) / (spheres[i].mass + spheres[j].mass));
								var newVelY2 = collisionDissipation*((spheres[j].velocity.y * (spheres[j].mass - spheres[i].mass) + (2 * spheres[i].mass * spheres[i].velocity.y)) / (spheres[i].mass + spheres[j].mass));

								// Update positions to prevent sticking
								spheres[i].position.x = spheres[i].position.x + 1.2*newVelX1;
								spheres[j].position.x = spheres[j].position.x + 1.2*newVelX2;
								spheres[i].position.y = spheres[i].position.y + 1.2*newVelY1;
								spheres[j].position.y = spheres[j].position.y + 1.2*newVelY2;

								// Update velocities with calculated ones
								spheres[i].velocity.set(0.98*newVelX1,0.98*newVelY1);
								spheres[j].velocity.set(0.98*newVelX2,0.98*newVelY2);

								// Unused
								// var collisionPoint = createVector(
								// 	// X
								// 	((spheres[i].position.x * spheres[j].mass/2) + (spheres[j].position.x * spheres[i].mass/2)) 
								//  	/ (spheres[i].mass/2 + spheres[j].mass/2),
								//  	// Y
								//  	((spheres[i].position.y * spheres[j].mass/2) + (spheres[j].position.y * spheres[i].mass/2)) 
								//  	/ (spheres[i].mass/2 + spheres[j].mass/2)
								// );

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

			// Get time for intervals
			currentTime = millis();


			// On-screen data

			// Display framerate
			push();
			textSize(dataFontSize);
			if(round(currentTime) % 10 == 0){
				fps = round(frameRate());
			}
			text(fps + ' fps',70, height-35);
			pop();
			

			push();
			fill(0);
			textSize(dataFontSize);
			textAlign(CENTER);
			text('Kinetic energy',width/4+50,50);
			if(totalKE == 0){
				text(totalKE.toFixed(1) + ' J',width/4+50,95);
			}else if(totalKE > 0 && totalKE < 1000){
				// console.log(totalKE);
				text(totalKE.toFixed(1) + ' mJ',width/4+50,95);
			}else if(totalKE >= 1000 && totalKE < 1000000){	
				text((totalKE/1000).toFixed(1) + ' J',width/4+50,95);
			}else if(totalKE >= 1000000 && totalKE < 1000000000){
				text((totalKE/1000000).toFixed(1) + ' KJ',width/4+50,95);
			}else{
				text((totalKE/1000000000).toFixed(1) + ' MJ',width/4+50,95);
			}
			pop();

			// display momentum
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

			// Display number of spheres created
			push();
			textSize(dataFontSize);
			textAlign(CENTER);
			text(spheres.length + "/" + maxSpheres,width-70,height-35);
			pop();
		}

		// console.log('deviceHasmoved == '+deviceHasMoved);
		// push();
		// fill(randColor);
		// ellipse(mouseX,mouseY,50,50);
		// pop();

}// end draw


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

function touchEnded(){
		// Only do this once per touch (in case touchEnded is called multiple times for the same event)
		
		if(touchEndedCount == 0){

			touchEndedCount++;
			launchNewSphere();

		}

}

function launchNewSphere(){

	sphereCreated = false;
	invalidSize = true;
	var attemptToFix = true;

	endTime = millis();
	var interval = endTime - beginTime;

	// Calculate new parameters
	var newPosition = createVector(mouseX, mouseY);
	var newVelocity = p5.Vector.div(p5.Vector.mult(p5.Vector.sub(newPosition,beginDist),4),map(interval,0,1000,0,1500)/4);
	var newAcceleration = globalAccel;
	var newMass = constrain(map(interval,0,500,25,125),75,400); // This may get reduced
	var randColor = color(floor(random(0,255)),floor(random(0,256)),floor(random(0,256)),floor(random(100,200)));
	// console.log(newMass);

	var count = 0;
	do{
		
		var d = 0;
		var ok = [];
		var inTheWay = 0;

		/*	Check the distance to each sphere. If the distance from the mouse to 
			the sphere is greater than the sum of the new radius and the radius of the 
			sphere being checked, mark its index as ok. If any index is not ok, reduce
			new mass until distance is ok. 	*/

		for(var i = 0; i < spheres.length; i++){

			d = dist(newPosition.x,newPosition.y,spheres[i].position.x,spheres[i].position.y);

			if (d > spheres[i].mass + newMass && d > spheres[i].mass/2) {
				ok[i] = true;	
			}else{
				ok[i] = false;
			}

			// See if every element of ok is true. If they are, let allOk remain true
			for(var i = 0; i < ok.length; i++){
				if(ok[i] == false){
					inTheWay++;
				}
			}
		}

		// console.log(inTheWay + ' overlapping');

		if(invalidSize && inTheWay == 0 && !sphereCreated && attemptToFix){
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


// Pause button
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

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
}

// Is device mobile?
function deviceMoved(){
	deviceHasMoved = true;
}


