var objectBoxRight;



var elems = [];
var spacing = width / 10;


function preload(){
	lens = loadImage("lens.svg");
}

function setup(){
	createCanvas(windowWidth,windowHeight);
	imageMode(CENTER);
	objectBoxRight = width/4;
}



function draw(){
	background(255);
	push();
	stroke(0);
	strokeWeight(1);
	line(objectBoxRight,0,objectBoxRight,height);
	strokeWeight(1);
	line(0,height/2,width,height/2);
	pop();
	for(var i=0; i<elems.length; i++){
		elems[i].display();
	}
}


function LensElement(x,f){
	this.focalLength = f;
	this.displacement  = x;

	this.display = function(){
		image(lens, this.displacement, height/2, width/this.focalLength, 4 * height/7);
	}
}


function mousePressed(){
	if(mouseX > objectBoxRight){	
		
		if(elems.length == 0){
			elems[elems.length] = new LensElement(mouseX,random(25,40));
		}else{
			for(var i = 0; i < elems.length; i++){	
				var d = dist(mouseX,height/2,elems[i].displacement,height/2);
				if(d > 200){
					elems[elems.length] = new LensElement(mouseX,random(25,40));
				}
			}
		}	
	}

}



