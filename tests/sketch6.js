var ball;

function setup(){
	createCanvas(windowWidth,windowHeight);
	frameRate(60);

	var temps = [createVector(random(50,width-50),random(50,height-50)), createVector(0,0), createVector(0,1), 50, color(255), 1, true];
 	ball = new FreeBodyMover(temps[0],temps[1],temps[2],temps[3],temps[4],temps[5],temps[6]);

}

function draw(){
	background(0);
	// ball.randomPosition();
	ball.edges();
	ball.update();
	ball.display();
	// console.log(ball.position.x + ", " + ball.position.y);
}



// p - position (Vector)
// v - velocity (Vector)
// a - acceleration (Vector)
// m - mass (number)
// c - color (Color)
// n - number of acting forces (number)
// r - show resultant (Boolean)
function FreeBodyMover(p, v, a, m, c, n, r){
   this.position = p;
   this.velocity = v;
   this.acceleration = a;
   this.mass = m;
   this.color = c;
   this.showResultant = r; 

   this.display = function(){
   		push();
   		fill(this.color);
   		ellipse(this.position.x,this.position.y,m,m);
   		pop();
   };

   this.update = function(){
   		this.velocity = this.velocity.add(this.acceleration);
   		this.position = this.position.add(this.velocity);
   };

   this.edges = function(){
   		if(this.position.x < this.mass/2|| this.position.x > width - this.mass/2 || this.position.y < this.mass/2 || this.position.y > height - this.mass/2){
   			this.velocity = createVector(0,0);
   			this.acceleration = createVector(0,0);
   		}
   };

   this.randomPosition = function(){
   		this.position = createVector(random(0,width),random(0,height));
   };


   this.netForce = function(){

   }
}
