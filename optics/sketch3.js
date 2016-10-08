
var lensCenter;
var focalLength;
var objectPosition;
var imagePosition;

var objectArrow;
var imageArrow;
var objectGhost;


function preload() {
  img = loadImage("img/lens1.svg");
}


function setup() {
  frameRate(30);
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  // distSlider = createSlider(20, width/2-50, width/4-50);
  // distSlider.position(width/4, height/4);
  // distSlider.style('width', '150px');
  // heightSlider = createSlider(-height/4, height/4, height/8);
  // heightSlider.position(width/4, height/4 + 20);
  // heightSlider.style('width', '150px');
  focalSlider = createSlider(100, 500, 300);
  focalSlider.position(width/2-0.054*width, height/2-.011*height);
  focalSlider.style('width', '150px');


  lensCenter = createVector(width/2,height/2);
  focalLength = createVector(focalSlider.value(),0);

  objectPosition = createVector(50,100);
  // objectGhost = createVector(lensCenter.x-(width/4-50),lensCenter.y-height/8);

  // objectPosition = createVector(lensCenter.x-distSlider.value(),lensCenter.y-heightSlider.value();
  

  // objDistArrow = new Arrow(center,objDist);
  // objDistArrow.color = color(0);
  // objDistArrow.draggable = false;
  // objDistArrow.grab = false;
  // objDistArrow.width = 4;

  // objHeightArrow = new Arrow();
  // objHeightArrow.color = color(0);
  // objHeightArrow.draggable = false;
  // objHeightArrow.grab = false;
  // objHeightArrow.width = 4;  

  // imgHeightArrow = new Arrow();
  // imgHeightArrow.color = color(0,200,0);
  // imgHeightArrow.draggable = false;
  // imgHeightArrow.grab = false;
  // imgHeightArrow.width = 4;


}

function draw() {
  // Environment

  background(255);
  image(img, width/2, height/2,width/30,height/2);
  noFill();
  stroke(0);
  rect(0,0,width-1,height-1);
  line(0,height/2,width,height/2);
  fill(0);
  ellipse(lensCenter.x,lensCenter.y,5,5);

  focalLength = createVector(focalSlider.value()/2,0);
  drawFocalPoints();

  // objectPosition = {x:0,y:0};
  
  // if(mouseX<=lensCenter.x){
  //   console.log(mouseX);
  // }


  imagePosition = newImagePosition(focalLength.x,lensCenter.x-objectPosition.x,lensCenter.y-objectPosition.y);

  drawArrows();
  
  // ellipse(objectPosition.x,objectPosition.y,10,10);
  // noFill();
  // ellipse(imagePosition.x,imagePosition.y,10,10);
  
  // drawFocalPoints();
  // drawLabels();
  // pr();

  displayValues();
}


// function drawFocalPoints(){
//   fill(0);
//   ellipse(width/2+focal_length,height/2,10,10);
//   ellipse(width/2-focal_length,height/2,10,10);
// }

function mousePressed(){

  if(!(mouseX<lensCenter.x+120 && mouseX>lensCenter.x-120 && mouseY<lensCenter.y+25 && mouseY>lensCenter-25)){
      objectPosition.x = mouseX;
      objectPosition.y = mouseY;
  }

  if(lensCenter.x-objectPosition.x <= 50 && lensCenter.x - objectPosition.x > 0 && lensCenter.y-objectPosition.y <= 10 && lensCenter.y-objectPosition.y > 0){
    objectPosition.x = lensCenter.x - 100;
  }else if(lensCenter.x - objectPosition.x <= 0 && lensCenter.x - objectPosition.x >= -50 && lensCenter.y-objectPosition.y <=0 && lensCenter.y-objectPosition.y > -10){
    objectPosition.x = lensCenter.x + 100;
  }
  
    // console.log({x:lensCenter.x-mouseX,y:lensCenter.y-mouseY});

}

function displayValues(){

  textAlign(CENTER);

  var leftBorder = 40;
  var rightBorder = width-40;

  var topBorder = 40;
  var bottomBorder = height-40;


  text('Focal length',lensCenter.x + focalLength.x, lensCenter.y - 5);
  text(focalLength.x,lensCenter.x + focalLength.x,lensCenter.y + 15);

  if(objectPosition.y<=lensCenter.y){
    text('Object height', objectPosition.x, objectPosition.y-50);
    text(lensCenter.y-objectPosition.y,objectPosition.x,objectPosition.y-30);
}else{
    text('Object height', objectPosition.x, objectPosition.y+30);
    text(lensCenter.y-objectPosition.y, objectPosition.x, objectPosition.y+50);
  }

if(objectPosition.y<=lensCenter.y){
  text('Object distance',objectPosition.x,lensCenter.y+15);
  text(round(lensCenter.x-objectPosition.x),objectPosition.x,lensCenter.y+35);
}else{
  text('Object distance',objectPosition.x,lensCenter.y-15);
  text(round(lensCenter.x-objectPosition.x),objectPosition.x,lensCenter.y-35);
}


  if(imagePosition.y<=lensCenter.y){
    text('image height', constrain(imagePosition.x,leftBorder,rightBorder), constrain(imagePosition.y-50,topBorder,bottomBorder));
    text(round(lensCenter.y-imagePosition.y),constrain(imagePosition.x,leftBorder,rightBorder),constrain(imagePosition.y-30,topBorder-20,bottomBorder));
}else{
    text('image height', constrain(imagePosition.x,leftBorder,rightBorder), constrain(imagePosition.y+30,topBorder,bottomBorder));
    text(round(lensCenter.y-imagePosition.y), constrain(imagePosition.x,leftBorder,rightBorder), constrain(imagePosition.y+50,topBorder-20,bottomBorder));
  }

if(imagePosition.y<=lensCenter.y){
  text('image distance',constrain(imagePosition.x,leftBorder,rightBorder),constrain(lensCenter.y+15,topBorder,bottomBorder));
  text(round(lensCenter.x-imagePosition.x),constrain(imagePosition.x,leftBorder,rightBorder),constrain(lensCenter.y+35,topBorder+20,bottomBorder));
}else{
  text('image distance',constrain(imagePosition.x,leftBorder,rightBorder),constrain(lensCenter.y-15,topBorder,bottomBorder));
  text(round(lensCenter.x-imagePosition.x),constrain(imagePosition.x,leftBorder,rightBorder),constrain(lensCenter.y-35,topBorder+20,bottomBorder));
}



}
function drawFocalPoints(){
  fill(0);
  ellipse(lensCenter.x+focalLength.x,lensCenter.y,5,5);
  ellipse(lensCenter.x-focalLength.x,lensCenter.y,5,5);
}


function drawArrows(){
  var objectOrigin = createVector(objectPosition.x,lensCenter.y);
  objectArrow = new Arrow(objectOrigin,objectPosition);
  objectArrow.color = color(0);
  objectArrow.display();
  objectArrow.draggable = false;
  objectArrow.grab = false;



  var imageOrigin = createVector(imagePosition.x,lensCenter.y);
  imageArrow = new Arrow(imageOrigin,imagePosition);

  if(imagePosition.x<lensCenter.x){
    imageArrow.color = color(100,0,0);
  }else{
    imageArrow.color = color(0,100,0);
  }
  imageArrow.display();
  imageArrow.draggable = false;
  objectArrow.grab = false;


}
// New
function newImagePosition(f,o,oh){
  if(o!=f){
    var x = o*f/(o-f);
  }else{
    var x = 999999;
  }

  if(o!=0){
    var y = x*oh/o;
  }else{
    var y = 999999;
  }
  return createVector(lensCenter.x+x,lensCenter.y+y);
}

// function drawLabels(){
//   textSize(16);
//   text("d",175,45);
//   text("h",175,65); 
//   text("f",176,86);
// }

// function pr() {
//   // console.log("image distance: " + image_distance);
//   // console.log("image height: " + image_height);
//   // console.log("object_distance: " + object_distance);
//   // console.log("object_height :" + object_height);
//   // console.log("focal length :" + focal_length);
// }

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  image(img,width/2,height/2);
}


// function keyPressed() {
//   if (keyCode == LEFT_ARROW) {
//     // objDistArrow.add(1);
//     object_distance += 1;
//   } else if (keyCode == RIGHT_ARROW) {
//     object_distance -= 1;
//   }

//   if (keyCode == UP_ARROW) {
//     radius += 1;
//   } else if (keyCode == DOWN_ARROW) {
//     radius -= 1;
//   }

//   updateFocus(radius);
//   updateHeight(object_height, object_distance, image_distance);
//   updateDistance(focal_length, object_distance);
//   
//   return false; // prevent default
// }