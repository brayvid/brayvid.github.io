var objectPosition;
var objectDistance;
var imagePosition;
var radius;
var center;


function setup(){

	createCanvas(600,400);

	center = createVector(width/2,height/2);
	objectPosition = createVector(width/2-random(0,width/2),height/2-random(0,height/2));

	objectArrow = new Arrow(objectPosition,objectPosition);
	objectArrow.color = color(0);



}

function draw(){

background(255);

objectArrow.update();
objectArrow.display();


}

function lensEquation(o,i,f,which){

	if(Number.isInteger(which)&&Number.isFinite(o)&&Number.isFinite(i)&&Number.isFinite(f)){
		if(which<4 && which>0){
			
			switch(which){

				case 1: // solve for object distance

					return ;

				case 2:

					return ;

				case 3:

					return ;


				default: 

					return "idk";
			}


		}
	}


}

