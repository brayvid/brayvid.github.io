
var radius;
var lensWidth = 35;
var maxDistance;

//Vectors
var center;
var focal_length;

var object_height;
var object_distance;

var image_height;
var image_distance;



//
var objectPosition;
var imagePosition;



//


function preload() {
  img = loadImage("img/lens1.svg");
}


function setup() {
  frameRate(30);
  createCanvas(800, 600);

  distSlider = createSlider(150, width/2-50, 200);
  distSlider.position(width/4, height/4);
  distSlider.style('width', '150px');

  heightSlider = createSlider(50, 125, 50);
  heightSlider.position(width/4, height/4 + 20);
  heightSlider.style('width', '150px');

  focalSlider = createSlider(40, 300, 200);
  focalSlider.position(width/4, height/4 + 40);
  focalSlider.style('width', '150px');


  center = createVector(width/2,height/2);

  objDist = createVector();
  objHeight = createVector();
  imgDist = createVector();
  imgHeight = createVector();

  


  objectPosition = distSlider.value();

  radius = focalSlider.value()*2;
  object_height = createVector(distSlider.value(),0);
  image_height = createVector();
  image_distance = createVector();
  focal_length = createVector();


  // objDistArrow = new Arrow(center,objDist);
  // objDistArrow.color = color(0);
  // objDistArrow.draggable = false;
  // objDistArrow.grab = false;
  // objDistArrow.width = 4;

  objHeightArrow = new Arrow(objDist,objHeight);
  objHeightArrow.color = color(0);
  objHeightArrow.draggable = false;
  objHeightArrow.grab = false;
  objHeightArrow.width = 4;  

  imgHeightArrow = new Arrow(imgDist,imgHeight);
  imgHeightArrow.color = color(0,200,0);
  imgHeightArrow.draggable = false;
  imgHeightArrow.grab = false;
  imgHeightArrow.width = 4;


}

function draw() {
  // Environment
  background(255);
  image(img, width/2-13, height/4);
  noFill();
  stroke(0);
  rect(0,0,width-1,height-1);
  line(0,height/2,width,height/2);


  objHeightArrow.display();
  imgHeightArrow.display();

  


  //Suspect
  updateFocus(radius);
  updateHeight(object_height, object_distance, image_distance);
  updateDistance(focal_length, object_distance);




  // Suspect 
  object_distance = distSlider.value();
  object_height = heightSlider.value();
  radius = focalSlider.value();



  objHeightArrow.origin = {
    x: object_distance,
    y: center.y
  };
  objHeightArrow.target = {
    x: object_distance,
    y: center.y-object_height
  };


  // if(width/2-objDist.x <= focal_length){
  imgHeightArrow.origin = {
    x: center.x+image_distance,
    y: center.y
   };
  imgHeightArrow.target = {
    x: center.x+image_distance ,
     y: center.y-image_height
   };

  // }else{
  //   imgHeightArrow.origin = {x: width/2-image_distance, y: center.y};
  //   imgHeightArrow.target = {x: width/2-image_distance , y: center.y+image_height};
  // }

  // objDistArrow.display();


  

  
  drawFocalPoints();
  drawLabels();
  pr();
}


function updateFocus(r) {
  focal_length = r / 2;
}

function updateHeight(oh, od, id) {
  // 	h'/h = -s'/s
  if (od != 0) {
    image_height = (-1 * oh * id) / od;
  }
}

function updateDistance(f, s) {
  if (f != s) {
    image_distance = (f * s) / (s - f);
  }
}

function drawFocalPoints(){
  fill(0);
  ellipse(width/2+focal_length,height/2,10,10);
  ellipse(width/2-focal_length,height/2,10,10);
}

function drawLabels(){
  textSize(16);
  text("d",175,45);
  text("h",175,65); 
  text("f",176,86);
}

function pr() {
  // console.log("image distance: " + image_distance);
  // console.log("image height: " + image_height);
  // console.log("object_distance: " + object_distance);
  // console.log("object_height :" + object_height);
  // console.log("focal length :" + focal_length);
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