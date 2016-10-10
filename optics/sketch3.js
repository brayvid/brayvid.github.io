
var lensCenter;
var focalLength;
var objectPosition;
var imagePosition;

var objectArrow;
var imageArrow;


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

  focalSlider = createSlider(100, 500, floor(random(100,500)));
  focalSlider.position(width/2-77, height/2-9);
  focalSlider.style('width', '150px');


  lensCenter = createVector(width/2,height/2);
  focalLength = createVector(focalSlider.value(),0);

  // objectPosition = createVector(round(width/4),round(height/6));

  objectArrow = new Arrow(createVector(round(width/4),lensCenter.y),createVector(round(width/4),round(random(0,height))));
  objectArrow.color = color(100,0,0);
  objectArrow.draggable = false;
  objectArrow.grab = true;

  imageArrow = new Arrow(objectArrow.origin,objectArrow.target);
  imageArrow.color = color(0,100,0);
  imageArrow.draggable = false;
  imageArrow.grab = false;

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
  image(img, width/2, height/2,(width/30)/(.005*focalSlider.value()),6*height/7);
  noFill();
  stroke(0);
  // rect(0,0,width-1,height-1);
  line(0,height/2,width,height/2);
  
  line(lensCenter.x,height/14,lensCenter.x,13*height/14);
  
  fill(0);
  // ellipse(lensCenter.x,lensCenter.y,5,5);

  focalLength = createVector(focalSlider.value()/2,0);
  drawFocalPoints();


  // objectPosition = {x:0,y:0};
  
  // if(mouseX<=lensCenter.x){
  //   console.log(mouseX);
  // }


  
  drawRays();
  drawArrows();
  
  
  // ellipse(objectArrow.target.x,objectArrow.target.y,10,10);
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



    


function drawRays(){

    // line1 = new Arrow(objectPosition,imagePosition);
    // line1.color = color(0);
    // line1.width=1;
    // line1.grab = false;
    // line1.display();

    // line2 = new Arrow(objectPosition,createVector(lensCenter.x,objectArrow.target.y));
    // line2.color = color(0);
    // line2.width=1;
    // line2.grab = false;
    // line2.display();

    // line3 = new Arrow(createVector(lensCenter.x,objectArrow.target.y),imagePosition);
    // line3.color = color(0);
    // line3.width=1;
    // line3.grab = false;
    // line3.display();
    stroke(0);

    if(lensCenter.x-objectArrow.target.x>focalLength.x){

    imageArrow.color = color(0,100,0);
    line(objectArrow.target.x,objectArrow.target.y,imageArrow.target.x,imageArrow.target.y);
    line(objectArrow.target.x,objectArrow.target.y,lensCenter.x,objectArrow.target.y);
    line(lensCenter.x,objectArrow.target.y,imageArrow.target.x,imageArrow.target.y);
    line(objectArrow.target.x,objectArrow.target.y,lensCenter.x,imageArrow.target.y);
    line(lensCenter.x,imageArrow.target.y,imageArrow.target.x,imageArrow.target.y);
  }

  if(lensCenter.x-objectArrow.target.x < focalLength.x && objectArrow.target.x < lensCenter.x){

    // line(imagePosition.x,imagePosition.y,lensCenter.x,lensCenter.y);
    imageArrow.color = color(0,200,0);
    for (var i = 0; i <= 50; i++) {
      var x = lerp(imageArrow.target.x, lensCenter.x, i/50.0);
      var y = lerp(imageArrow.target.y, lensCenter.y, i/50.0);
      ellipse(x, y,2,2);
    }

    for (var i = 0; i <= 50; i++) {
      var x = lerp(lensCenter.x-focalLength.x, lensCenter.x, i/50.0);
      var y = lerp(lensCenter.y, imageArrow.target.y, i/50.0);
      ellipse(x, y,2,2);
    }

    for (var i = 0; i <= 50; i++) {
      var x = lerp(imageArrow.target.x, lensCenter.x, i/50.0);
      var y = lerp(imageArrow.target.y, imageArrow.target.y, i/50.0);
      ellipse(x, y,2,2);
    }

    // line(,,lensCenter.x,);
    
    // line(imagePosition.x,imagePosition.y,lensCenter.x,imagePosition.y);
  }



}

// function mousePressed(){

//   if(!(mouseX<lensCenter.x+120 && mouseX>lensCenter.x-120 && mouseY<lensCenter.y+25 && mouseY>lensCenter-25)){
//       objectArrow.target.x = mouseX;
//       objectArrow.target.y = mouseY;
//   }

//   if(lensCenter.x-objectArrow.target.x <= 50 && lensCenter.x - objectArrow.target.x > 0 && lensCenter.y-objectArrow.target.y <= 10 && lensCenter.y-objectArrow.target.y > 0){
//     objectArrow.target.x = lensCenter.x - 100;
//   }else if(lensCenter.x - objectArrow.target.x <= 0 && lensCenter.x - objectArrow.target.x >= -50 && lensCenter.y-objectArrow.target.y <=0 && lensCenter.y-objectArrow.target.y > -10){
//     objectArrow.target.x = lensCenter.x + 100;
//   }
  
//     // console.log({x:lensCenter.x-mouseX,y:lensCenter.y-mouseY});

// }

function displayValues(){

  textAlign(CENTER);

  var leftBorder = 40;
  var rightBorder = width-40;

  var topBorder = 40;
  var bottomBorder = height-40;


  // text('Focal length',lensCenter.x + focalLength.x, lensCenter.y - 5);
  // text(focalLength.x,lensCenter.x + focalLength.x,lensCenter.y + 15);

  if(objectArrow.target.y<=lensCenter.y){
    text('Object height', objectArrow.target.x, objectArrow.target.y-50);
    text(lensCenter.y-objectArrow.target.y,objectArrow.target.x,objectArrow.target.y-30);
}else{
    text('Object height', objectArrow.target.x, objectArrow.target.y+30);
    text(lensCenter.y-objectArrow.target.y, objectArrow.target.x, objectArrow.target.y+50);
  }

if(objectArrow.target.y<=lensCenter.y){
  text('Object distance',objectArrow.target.x,lensCenter.y+15);
  text(round(lensCenter.x-objectArrow.target.x),objectArrow.target.x,lensCenter.y+35);
}else{
  text('Object distance',objectArrow.target.x,lensCenter.y-15);
  text(round(lensCenter.x-objectArrow.target.x),objectArrow.target.x,lensCenter.y-35);
}


  if(imageArrow.target.y<=lensCenter.y){
    // on top
    text('image height', constrain(imageArrow.target.x,leftBorder,rightBorder), constrain(imageArrow.target.y-50,topBorder,bottomBorder));
    text(round(lensCenter.y-imageArrow.target.y),constrain(imageArrow.target.x,leftBorder,rightBorder),constrain(imageArrow.target.y-30,topBorder-20,bottomBorder));
}else{
  // on bottom
    text('image height', constrain(imageArrow.target.x,leftBorder,rightBorder), constrain(imageArrow.target.y-15,topBorder,bottomBorder));
    text(round(lensCenter.y-imageArrow.target.y), constrain(imageArrow.target.x,leftBorder,rightBorder), constrain(imageArrow.target.y-35,topBorder+20,bottomBorder-20));
  }

if(imageArrow.target.y<=lensCenter.y){
  // on top
  text('image distance',constrain(imageArrow.target.x,leftBorder,rightBorder),constrain(lensCenter.y+15,topBorder,bottomBorder));
  text(round(lensCenter.x-imageArrow.target.x),constrain(imageArrow.target.x,leftBorder,rightBorder),constrain(lensCenter.y+35,topBorder+20,bottomBorder));
}else{
  // on bottom
  text('image distance',constrain(imageArrow.target.x,leftBorder,rightBorder),constrain(lensCenter.y-15,topBorder,bottomBorder));
  text(round(lensCenter.x-imageArrow.target.x),constrain(imageArrow.target.x,leftBorder,rightBorder),constrain(lensCenter.y-35,topBorder+20,bottomBorder-20));
}


  text('Object distance',width-200,50);
  text('Focal length',width-100,50);


if(lensCenter.x-objectArrow.target.x + 1 < focalLength.x && objectArrow.target.x < lensCenter.x){
  text('<',width-145,50);
}else if(lensCenter.x-objectArrow.target.x  -1 > focalLength.x && objectArrow.target.x < lensCenter.x){
  text('>',width-145,50);
}else if(abs(lensCenter.x-objectArrow.target.x-focalLength.x)<1){
  text('=',width-145,50);
}

if(objectArrow.target.x > lensCenter.x){

}



}
function drawFocalPoints(){
  line(lensCenter.x+focalLength.x-5,lensCenter.y-5,lensCenter.x+focalLength.x+5,lensCenter.y+5);
  line(lensCenter.x+focalLength.x+5,lensCenter.y-5,lensCenter.x+focalLength.x-5,lensCenter.y+5);
  line(lensCenter.x-focalLength.x-5,lensCenter.y-5,lensCenter.x-focalLength.x+5,lensCenter.y+5);
  line(lensCenter.x-focalLength.x+5,lensCenter.y-5,lensCenter.x-focalLength.x-5,lensCenter.y+5);
}


function drawArrows(){
  
  // var objectOrigin = createVector(objectArrow.target.x,lensCenter.y);
  // objectArrow = new Arrow(objectOrigin,objectPosition);
  // objectArrow.color = color(0);

  imagePosition = newImagePosition(focalLength.x,lensCenter.x-objectArrow.target.x,lensCenter.y-objectArrow.target.y);

  objectArrow.origin = {x:objectArrow.target.x,y:lensCenter.y};
  imageArrow.target = {x:imagePosition.x,y:imagePosition.y};
  imageArrow.origin = {x:imageArrow.target.x,y:lensCenter.y};

  objectArrow.update();
  objectArrow.display();
  imageArrow.update();
  imageArrow.display();

  // var imageOrigin = createVector(imagePosition.x,lensCenter.y);
  

  // if(imagePosition.x<lensCenter.x){
  //   imageArrow.color = color(100,0,0);
  // }else{
  //   imageArrow.color = color(0,100,0);
  // }
  


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
  focalSlider.position(width/2-77, height/2-9);
  lensCenter.x = width/2;
  lensCenter.y = height/2;
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