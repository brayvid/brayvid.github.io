
var lensCenter;
var focalLength;
var objectPosition;
var imagePosition;

var objectArrow;
var imageArrow;

function preload() {
  img = loadImage("img/lens1.svg");
  eye = loadImage("img/eye.png");
}

function setup() {
  frameRate(30);
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);

  focalSlider = createSlider(100, 500, floor(random(250,500)));
  focalSlider.position(width/2-77, height/2-9);
  focalSlider.style('width', '150px');

  lensCenter = createVector(width/2,height/2);
  focalLength = createVector(focalSlider.value(),0);

  objectArrow = new Arrow(createVector(round(width/4),lensCenter.y),createVector(round(width/4),round(random(50,height-200))));
  objectArrow.color = color(190,0,0);
  objectArrow.draggable = false;
  objectArrow.grab = true;

  imageArrow = new Arrow(objectArrow.origin,objectArrow.target);
  imageArrow.draggable = false;
  imageArrow.grab = false;
}

function draw() {
  // Environment
  background(255);
  image(img, width/2, height/2,(width/30)/(.005*focalSlider.value()),6*height/7);
  image(eye,width-25,height/2-15,150,150);
  noFill();
  stroke(0);
  
  line(0,height/2,width-50,height/2);
  push();
  stroke('rgba(0,0,0,0.3)');
  line(lensCenter.x,height/14,lensCenter.x,13*height/14);
  pop();
  // push();
  // strokeWeight(3);
  // stroke(255,0,0);
  // fill('rgba(255,0,0,0.05)');
  // rect(20,20,lensCenter.x-20,height-40);
  // pop();

  // ellipse(lensCenter.x,lensCenter.y,5,5);

  focalLength = createVector(focalSlider.value()/2,0);
  drawFocalPoints();
  drawArrows();
  drawRays();
  displayValues();
}    


function drawRays(){
    stroke(0);
    if(lensCenter.x-objectArrow.target.x>focalLength.x){
      imageArrow.color = color('rgba(0,200,0,0.65)');
      line(objectArrow.target.x,objectArrow.target.y,imageArrow.target.x,imageArrow.target.y);
      line(objectArrow.target.x,objectArrow.target.y,lensCenter.x,objectArrow.target.y);
      line(lensCenter.x,objectArrow.target.y,imageArrow.target.x,imageArrow.target.y);
      line(objectArrow.target.x,objectArrow.target.y,lensCenter.x,imageArrow.target.y);
      line(lensCenter.x,imageArrow.target.y,imageArrow.target.x,imageArrow.target.y);
    }

    if(lensCenter.x-objectArrow.target.x < focalLength.x && objectArrow.target.x < lensCenter.x){
      imageArrow.color = color('rgba(200,0,0,0.2)');

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
  fill(0);
  var leftBorder = 40;
  var rightBorder = width-40;
  var topBorder = 40;
  var bottomBorder = height-40;

  // Focal length
  push();
  textSize(16);
  fill(0);
  text('f',lensCenter.x,lensCenter.y-10);
  text(focalLength.x,lensCenter.x,lensCenter.y+25);
  pop();

  // push();
  // rectMode(CENTER);
  // fill(255);
  // rect(lensCenter.x,35,150,35);
  // rect(lensCenter.x-200,35,150,35);
  // rect(lensCenter.x+200,35,150,35);
  // rect(lensCenter.x-400,35,150,35);
  // rect(lensCenter.x+400,35,150,35);
  // pop();

// START COMMENT
  // text('Focal length',lensCenter.x + focalLength.x, lensCenter.y - 5);
  // text(focalLength.x,lensCenter.x + focalLength.x,lensCenter.y + 15);

  if(objectArrow.target.y<=lensCenter.y){
    text('Object height', objectArrow.target.x, objectArrow.target.y-50);
    text(lensCenter.y-objectArrow.target.y,objectArrow.target.x,objectArrow.target.y-30);
    text('Object distance',objectArrow.target.x,lensCenter.y+15);
    text(round(lensCenter.x-objectArrow.target.x),objectArrow.target.x,lensCenter.y+35);
}else{
    text('Object height', objectArrow.target.x, objectArrow.target.y+30);
    text(lensCenter.y-objectArrow.target.y, objectArrow.target.x, objectArrow.target.y+50);
    text('Object distance',objectArrow.target.x,lensCenter.y-15);
    text(round(lensCenter.x-objectArrow.target.x),objectArrow.target.x,lensCenter.y-35);
  }


  if(imageArrow.target.y<=lensCenter.y){
    // on top
    text('Image height', constrain(imageArrow.target.x,leftBorder,rightBorder), constrain(imageArrow.target.y-50,topBorder,bottomBorder));
    text(round(lensCenter.y-imageArrow.target.y),constrain(imageArrow.target.x,leftBorder,rightBorder),constrain(imageArrow.target.y-30,topBorder+20,bottomBorder));
    text('Image distance',constrain(imageArrow.target.x,leftBorder,rightBorder),constrain(lensCenter.y+15,topBorder,bottomBorder));
    text(round(lensCenter.x-imageArrow.target.x),constrain(imageArrow.target.x,leftBorder,rightBorder),constrain(lensCenter.y+35,topBorder+20,bottomBorder));
}else{
  // on bottom
    text('Image height', constrain(imageArrow.target.x,leftBorder,rightBorder), constrain(imageArrow.target.y+15,topBorder,bottomBorder-20));
    text(round(lensCenter.y-imageArrow.target.y), constrain(imageArrow.target.x,leftBorder,rightBorder), constrain(imageArrow.target.y+35,topBorder,bottomBorder));
    text('Image distance',constrain(imageArrow.target.x,leftBorder,rightBorder),constrain(lensCenter.y-15,topBorder,bottomBorder));
    text(round(lensCenter.x-imageArrow.target.x),constrain(imageArrow.target.x,leftBorder,rightBorder),constrain(lensCenter.y-35,topBorder+20,bottomBorder-20));
  }


//   text('Object distance',width-200,50);
//   text('Focal length',width-100,50);


// if(lensCenter.x-objectArrow.target.x + 1 < focalLength.x && objectArrow.target.x < lensCenter.x){
//   text('<',width-145,50);
// }else if(lensCenter.x-objectArrow.target.x  -1 > focalLength.x && objectArrow.target.x < lensCenter.x){
//   text('>',width-145,50);
// }else if(abs(lensCenter.x-objectArrow.target.x-focalLength.x)<1){
//   text('=',width-145,50);
// }

// if(objectArrow.target.x > lensCenter.x){

// }
// END COMMENT

}

function drawFocalPoints(){
  // RIGHT
  line(lensCenter.x+focalLength.x-5,lensCenter.y-5,lensCenter.x+focalLength.x+5,lensCenter.y+5);
  line(lensCenter.x+focalLength.x+5,lensCenter.y-5,lensCenter.x+focalLength.x-5,lensCenter.y+5);
  // LEFT
  line(lensCenter.x-focalLength.x-5,lensCenter.y-5,lensCenter.x-focalLength.x+5,lensCenter.y+5);
  line(lensCenter.x-focalLength.x+5,lensCenter.y-5,lensCenter.x-focalLength.x-5,lensCenter.y+5);
}


function drawArrows(){
  // FIX ARROW ORIGINS TO HORIZONTAL AXIS
  
  objectArrow.origin = {x:objectArrow.target.x,y:lensCenter.y};
  imageArrow.origin = {x:imageArrow.target.x,y:lensCenter.y};
  imageArrow.target = newImagePosition(focalLength.x,lensCenter.x-objectArrow.target.x,lensCenter.y-objectArrow.target.y);

  objectArrow.update();
  imageArrow.update();
  if(objectArrow.target.x>=lensCenter.x-1){
    objectArrow.target.x = lensCenter.x-1;
  }
  if(objectArrow.target.x<=20){
    objectArrow.target.x = 20;
  }
  if(objectArrow.target.y<=20){
    objectArrow.target.y = 20;
  }
  if(objectArrow.target.y>=height-20){
    objectArrow.target.y = height-20;
  }
  objectArrow.display();
  imageArrow.display();
}

function newImagePosition(f,o,oh){
  // LENS FORMULA
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  image(img,width/2,height/2);
  focalSlider.position(width/2-77, height/2-9);
  lensCenter.x = width/2;
  lensCenter.y = height/2;
}
