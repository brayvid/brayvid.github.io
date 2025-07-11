/* 2D Collision Simulator in p5.js
   @author Blake Rayvid <https://github.com/brayvid>
   @version 10.17.2016 (Modernized for Responsiveness 2024)
*/

// --- Original Global Variables ---
var spheres = [];
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
var started;
var stopAll;
var touchEndedCount = 0; // The original bug-free implementation
var beginDist;
var beginTime;
var netMomentumArrow;

// --- New/Modified Variables for UI and FPS ---
var dataFontSize;
var displayedFps = 0;
var lastFpsUpdateTime = 0;
var keLabelPos, pLabelPos, fpsLabelPos, countLabelPos;


function setup(){
	createCanvas(windowWidth,windowHeight);
	frameRate(60);
	textStyle(BOLD);
	textAlign(CENTER);

	initialSpheres = 1;
	globalAccelOn = false;
	globalAccel = createVector(0,0);
	collisionsOn = true;
	wallDissipation = 1;
	collisionDissipation = 1;
	started = false;
	collisionCount = 0;
	stopAll = false;
	maxSpheres = 50;
	totalKE = 0;
	totalP = createVector(0,0);

    // **FIX**: Create a function to handle responsive layout
    updateLayout();

	netMomentumArrow = new Arrow(createVector(0,0), createVector(0,0)); // Position will be set dynamically
	netMomentumArrow.draggable = false;
	netMomentumArrow.grab = false;
	netMomentumArrow.color = color(0,0,0,255);
	netMomentumArrow.width = 20;

	for(var i = 0; i < initialSpheres; i++){
		spheres[i] = new Sphere(
			createVector(random(width/4,3*width/4), random(height/4,3*height/4)),
			createVector(random(-5, 5), random(-5, 5)), // Reduced initial velocity
			createVector(0, 0), // Original code had random accel, but it's overwritten by globalAccel
			random(75,90),
			color(random(255), random(255), random(255), 150)
        );
	}
}

// **FIX**: New function to make UI responsive
function updateLayout() {
    // Responsive font size based on the smaller screen dimension
    var baseSize = min(width, height);
    dataFontSize = constrain(baseSize / 30, 12, 28);

    // Dynamically calculate UI positions
    keLabelPos = { x: width * 0.25, y: height * 0.08 };
    pLabelPos = { x: width * 0.75, y: height * 0.08 };
    fpsLabelPos = { x: width * 0.1, y: height * 0.95 };
    countLabelPos = { x: width * 0.9, y: height * 0.95 };
}

// Original Sphere object - Untouched
function Sphere(p, v, a, m, c){
	this.position = p;
	this.velocity = v;
	this.acceleration = a;
	this.mass = m;
	this.color = c;
	this.momentum = p5.Vector.mult(this.velocity,this.mass);
	this.kineticEnergy = 0.5 * this.mass * Math.pow(p5.Vector.mag(this.velocity),2);
	this.momentumArrow = new Arrow(this.position,p5.Vector.add(this.position,this.momentum));
	this.momentumArrow.color = color(0,0,0,255);
	this.momentumArrow.grab = false;
	this.momentumArrow.draggable = false;
	this.momentumArrow.width = 10;
	this.refresh = function(){
        if(this.position.x < 0+this.mass/2){var overinx = this.position.x-this.mass/2;var vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);this.velocity.x = wallDissipation*vatwidth;this.position.x = 0+this.mass/2;}
        if(this.position.x > width-this.mass/2){var overinx = this.position.x-width+this.mass/2;var vatwidth = Math.sqrt(Math.pow(this.velocity.x,2)-2*this.acceleration.x*overinx);this.position.x = width-this.mass/2;this.velocity.x = -wallDissipation*vatwidth;}
        if(this.position.y < 0+this.mass/2){var overiny = this.position.y-this.mass/2;var vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);this.velocity.y = wallDissipation*vatheight;this.position.y = 0+this.mass/2;}
        if(this.position.y > height-this.mass/2){var overiny = this.position.y-height+this.mass/2;var vatheight = Math.sqrt(Math.pow(this.velocity.y,2)-2*this.acceleration.y*overiny);this.position.y = height-this.mass/2;this.velocity.y = -wallDissipation*vatheight;}
        this.acceleration = p5.Vector.add(createVector(0,0),globalAccel);
        var tempVelocity = p5.Vector.add(this.velocity,this.acceleration);
        this.velocity.x = (tempVelocity.x + this.velocity.x) / 2;
        this.velocity.y = (tempVelocity.y + this.velocity.y) / 2;
        this.position = p5.Vector.add(this.position,this.velocity);
        this.kineticEnergy = 0.5 * this.mass * (Math.pow(this.velocity.x,2)+Math.pow(this.velocity.y,2));
        this.momentum = p5.Vector.mult(this.velocity,this.mass);
        this.momentumArrow.origin = this.position;
        var arrowVector = this.momentum.copy().setMag(constrain(this.momentum.mag()/50, 0, this.mass * 1.5));
        this.momentumArrow.target = p5.Vector.add(this.position, arrowVector);
        push();
        fill(this.color);
        stroke(0);
        ellipse(this.position.x,this.position.y,this.mass,this.mass);
        pop();
        this.momentumArrow.display();
    };
	this.intersects = function(other){var d = dist(this.position.x,this.position.y,other.position.x,other.position.y);if(d < (this.mass/2) + (other.mass/2)){return true;}else{return false;}};
	this.newColor = function(other){var r, g, b, a;if(p5.Vector.mag(other.momentum) > p5.Vector.mag(this.momentum)){r = red(other.color);g = green(other.color);b = blue(other.color);a = alpha(this.color);this.color = color(r,g,b,a);}else{r = red(this.color);g = green(this.color);b = blue(this.color);a = alpha(other.color);other.color = color(r,g,b,a);}};
}

function draw(){
    if (stopAll) return; // Simplified pause logic

	background(255);
			
	if(!started){
        // **FIX**: Responsive intro screen
        push();
        fill(50);
        textAlign(CENTER, CENTER);
        textSize(dataFontSize * 1.2);
        text('Tap or drag to launch a sphere', width / 2, height / 2 - (dataFontSize * 2));
        textSize(dataFontSize * 0.9);
        let yOffset = height / 2 + dataFontSize;
        let lineHeight = dataFontSize * 1.5;
        text(collisionsOn ? 'Collisions: ON' : 'Collisions: OFF', width / 2, yOffset);
        text(globalAccelOn ? 'Gravity: ON' : 'Gravity: OFF', width / 2, yOffset + lineHeight);
        text((Math.abs(wallDissipation-1.0) < 0.001 && Math.abs(collisionDissipation-1.0) < 0.001) ? 'Energy Loss: OFF' : 'Energy Loss: ON', width / 2, yOffset + lineHeight * 2);
        pop();
	}

	if(globalAccelOn && !stopAll){
		globalAccel.x = map(constrain(rotationY,-45,45),-45,45,-2,2);
		globalAccel.y = map(constrain(rotationX,-45,45),-45,45,-2,2);
	}

	for(var i = 0; i < spheres.length; i++){
		spheres[i].refresh();
	}

	if(spheres.length > maxSpheres){
		spheres.splice(0, spheres.length - maxSpheres);
	}

	if(collisionsOn){
        // **NOTE**: Using original collision loop. It's less efficient but known to be stable with this physics model.
		for(var i = 0; i < spheres.length; i++){
			for(var j = 0; j < spheres.length; j++){
				if(i != j && spheres[i].intersects(spheres[j])){
					var newVelX1 = collisionDissipation*((spheres[i].velocity.x * (spheres[i].mass - spheres[j].mass) + (2 * spheres[j].mass * spheres[j].velocity.x)) / (spheres[i].mass + spheres[j].mass));
					var newVelY1 = collisionDissipation*((spheres[i].velocity.y * (spheres[i].mass - spheres[j].mass) + (2 * spheres[j].mass * spheres[j].velocity.y)) / (spheres[i].mass + spheres[j].mass));
					var newVelX2 = collisionDissipation*((spheres[j].velocity.x * (spheres[j].mass - spheres[i].mass) + (2 * spheres[i].mass * spheres[i].velocity.x)) / (spheres[i].mass + spheres[j].mass));
					var newVelY2 = collisionDissipation*((spheres[j].velocity.y * (spheres[j].mass - spheres[i].mass) + (2 * spheres[i].mass * spheres[i].velocity.y)) / (spheres[i].mass + spheres[j].mass));
					spheres[i].position.x += newVelX1;
					spheres[j].position.x += newVelX2;
					spheres[i].position.y += newVelY1;
					spheres[j].position.y += newVelY2;
					spheres[i].velocity.set(newVelX1,newVelY1);
					spheres[j].velocity.set(newVelX2,newVelY2);
					spheres[i].newColor(spheres[j]);
					collisionCount++;
				}
			}
		}
	}

	totalKE = 0;
	for(var i = 0; i < spheres.length; i++){ totalKE += spheres[i].kineticEnergy; }
	totalP.set(0,0);
	for(var i = 0; i < spheres.length; i++){ totalP.add(spheres[i].momentum); }

    // --- On-screen data (with responsive fixes) ---
    if (millis() - lastFpsUpdateTime > 1000) {
        displayedFps = floor(frameRate());
        lastFpsUpdateTime = millis();
    }
    
    push();
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(dataFontSize);
    text(displayedFps + ' fps', fpsLabelPos.x, fpsLabelPos.y);
    text(spheres.length + "/" + maxSpheres, countLabelPos.x, countLabelPos.y);
    
    textSize(dataFontSize);
    text('Kinetic Energy', keLabelPos.x, keLabelPos.y);
    var keText = (totalKE/1000).toFixed(1) + ' J'; // Simplified display
    text(keText, keLabelPos.x, keLabelPos.y + dataFontSize * 1.2);

    text('Net Momentum', pLabelPos.x, pLabelPos.y);
    var pText = (totalP.mag()/60).toFixed(1) + ' g·cm/s';
    text(pText, pLabelPos.x, pLabelPos.y + dataFontSize * 1.2);

    if(totalP.mag() != 0){
        netMomentumArrow.origin = createVector(pLabelPos.x, pLabelPos.y + dataFontSize * 2.5);
        netMomentumArrow.target = p5.Vector.add(netMomentumArrow.origin, totalP.copy().normalize().mult(dataFontSize * 1.2));
		netMomentumArrow.display();
	}
    pop();
}

// Original input functions - UNTOUCHED. This is the fix for the double-launch bug.
function touchStarted(){
	if(!started){
		started = true;
	}
	beginDist = createVector(mouseX,mouseY);
	beginTime = millis();
	touchEndedCount = 0;
}
function touchEnded(){
	if(touchEndedCount == 0){
		touchEndedCount++;
		launchNewSphere();
	}
}
function launchNewSphere(){
	var sphereCreated = false;
	var invalidSize = true;
	var attemptToFix = true;
	var endTime = millis();
	var interval = endTime - beginTime;
	var newPosition = createVector(mouseX, mouseY);
	var newVelocity = p5.Vector.div(p5.Vector.mult(p5.Vector.sub(newPosition,beginDist),4),map(interval,0,1000,0,1500)/4);
	var newAcceleration = globalAccel;
	var newMass = constrain(map(interval,0,500,25,125),75,400);
	var randColor = color(floor(random(0,255)),floor(random(0,256)),floor(random(0,256)),floor(random(100,200)));
	var count = 0;
	do{
		var inTheWay = 0;
		for(var i = 0; i < spheres.length; i++){
			var d = dist(newPosition.x,newPosition.y,spheres[i].position.x,spheres[i].position.y);
			if (d <= spheres[i].mass/2 + newMass/2) {
				inTheWay++;
			}
		}
		if(inTheWay == 0 && !sphereCreated && attemptToFix){
			spheres[spheres.length] = new Sphere(newPosition,newVelocity,newAcceleration,newMass,randColor);
			sphereCreated = true;
			invalidSize = false;
			attemptToFix = false;
		}else{
			if(newMass > 25){
				newMass -= 3;
			}else{
				attemptToFix = false;
			}
		} 
		count++;
	}while(invalidSize && !sphereCreated && attemptToFix && count<50);
}

// Original utility functions
function keyPressed(){
	if(keyCode == 32){
		stopAll = !stopAll;
        if(stopAll) { noLoop(); } else { loop(); } // Correct way to pause p5
	}
}
function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
    updateLayout(); // Make sure UI is responsive
}