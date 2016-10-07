var lensCenter;

var object;

var img;

var objectArrow;

var imgArrow;


function setup(){
createCanvas(800,600);
lensCenter = createVector(width/2,height/2);
object = createVector(0,0); 



}


function draw(){
background(255);
object = {x: mouseX, y: mouseY};
objectArrow = new Arrow(createVector(object.x,lensCenter.y),createVector(object.x,object.y));

ellipse(constrain(object.x,10,lensCenter.x),constrain(object.y,10,lensCenter.y),10,10);

drawAxis();




}

function drawAxis(){
	line(10,lensCenter.y,width-10,lensCenter.y);
}