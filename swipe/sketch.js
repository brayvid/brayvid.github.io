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


function FreeBodyMover(p, v, a, m, c){
	// Properties
	this.position = p;
	this.velocity = v;
	this.acceleration = a;
	this.mass = m;
	this.color = c;
	this.fbd = {
		forces: [],
		netForce: function(forces){
			var net = createVector(0,0);
			for(var i = 0; i < self.forces.length; i++){
				net = p5.Vector.add(net,self.forces[i]);
			}
			return net;
		}
	};

	// Methods
	this.act = function(force){
		// add a force to the array of acting forces
		this.fbd.forces[this.fbd.forces.length+1] = force;
	}; //end act()

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

			// Display
			push();
			fill(this.color);
			ellipse(this.position.x,this.position.y,this.mass,this.mass);
			pop();
	};//end refresh()

}// End FreeBodyMover object

function setup(){

	frameRate(48);
	currentFrameRate = frameRate();
	createCanvas(windowWidth,windowHeight);
	balls = [];
	globalAcc = createVector(0,0);
	started = false;
	currentTime = millis();
}

function draw(){
	background(255);
	currentTime = millis();
	push();
	textSize(24);
	if(round(currentTime) % 10 == 0){
		currentFrameRate = round(frameRate());
	}
	text(currentFrameRate,30, height-25);
	pop();
	
	if(currentTime - touchTime < 200 || !started){
		push();
		textAlign(CENTER);
		textSize(27);
		fill(map(currentTime,0, 6000,0, 255));
		text('Tap or swipe to launch balls',width/2,(height/2)-20);
		text('(Ensure screen rotation is locked)',width/2,(height/2)+20);
		pop();
	}

	// Recalculate acceleration 
	globalAcc.x = map(constrain(rotationY,-50,50),-50,50,-1.5,1.5);
	globalAcc.y = map(constrain(rotationX,-50,50),-50,50,-1.5,1.5);

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
	console.log('x: ' + rotationX +',y: '+rotationY);
}

function touchStarted(){
	 // For displaying info text
	if(!started){
		touchTime = millis();
		started = true;
	}
	timeStarted = millis();
	beginDist = createVector(mouseX,mouseY);
	beginTime = millis();
}

function touchEnded(){
	endDist = createVector(mouseX, mouseY);
	endTime = millis();
	var interval = endTime - beginTime;
	newVelocity = p5.Vector.div(p5.Vector.mult(p5.Vector.sub(endDist,beginDist),4),(endTime-beginTime)/4);
	balls[balls.length] = new FreeBodyMover(createVector(mouseX,mouseY),createVector(newVelocity.x,newVelocity.y),createVector(globalAcc.x,globalAcc.y),50,color(random(0,255),random(0,255),random(0,255),random(0,255)));
}

function windowResized(){
	resizeCanvas(windowWidth,windowHeight);
	// Something else
	
}

// function deviceTurned(){
// 	for(var i = 0; i < balls.length; i++){
// 		balls.splice(i,1);
// 		}
// }