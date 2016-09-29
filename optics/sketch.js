var object_height = 50;
var object_distance;

var image_height;
var image_distance;

var radius;
var focal_length;

var axis;

var lensWidth = 35;



function setup() {

  

  frameRate(30);
  createCanvas(800, 600);

  axis = height/2;

  distSlider = createSlider(50, width/2-lensWidth, 200);
  distSlider.position(width/4, height/4);
  distSlider.style('width', '150px');

  heightSlider = createSlider(25, height/2-75, 200);
  heightSlider.position(width/4, height/4 + 20);
  heightSlider.style('width', '150px');

  radius = 70;
  image_height = 0;
  image_distance = 0;
  focal_length = 1;


  origin = createVector(width/2,axis);
  objDist = p5.Vector.add(origin,-1*object_distance);
  objHeight = createVector(objDist.x, axis-object_height);

  objDistArrow = new Arrow(origin,objDist);

  objDistArrow.color = color(0);
  objDistArrow.draggable = false;
  objDistArrow.grab = false;
  objDistArrow.width = 4;


  objHeightArrow = new Arrow(objDist,objHeight);

  objHeightArrow.color = color(0);
  objHeightArrow.draggable = false;
  objHeightArrow.grab = false;
  objHeightArrow.width = 4;


  imgDist = p5.Vector.add(origin,image_distance);
  imgHeight = createVector(imgDist.x, axis+image_height);


  imgHeightArrow = new Arrow(imgDist,imgHeight);

  imgHeightArrow.color = color(0);
  imgHeightArrow.draggable = false;
  imgHeightArrow.grab = false;
  imgHeightArrow.width = 4;



}

function draw() {
  background(180);




  objDistArrow.update();
  // objDistArrow.display();
  objHeightArrow.update();
  objHeightArrow.display();

  object_distance = distSlider.value();
  object_height = heightSlider.value();
  


  objDistArrow.target = {x: object_distance, y: axis};

  objHeightArrow.origin = {x: object_distance, y: axis};
  objHeightArrow.target = {x: object_distance, y: axis-object_height};

  imgHeightArrow.origin = {x: width/2+image_distance, y: axis};
  imgHeightArrow.target = {x: width/2+image_distance , y: axis-image_height};

  // objDistArrow.display();
  imgHeightArrow.update();
  imgHeightArrow.display();


  updateFocus(radius);
  updateHeight(object_height, object_distance, image_distance);
  updateDistance(focal_length, object_distance);


  

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




function pr() {
  console.log("image distance: " + image_distance);
  console.log("image height: " + image_height);
  console.log("object_distance: " + object_distance);
  console.log("object_height :" + object_height);
  console.log("focal length :" + focal_length);
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