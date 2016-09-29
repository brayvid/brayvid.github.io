var object_height = 25;
var object_distance;

var image_height;
var image_distance;

var radius;
var focal_length;






function setup() {

  frameRate(0.5);
  createCanvas(600, 400);
  object_distance = 100;
  radius = 70;

  image_height = 0;
  image_distance = 0;
  focal_length = 1;

  origin = createVector(width/2,height/2);

  objDist = p5.Vector.add(origin,-1*object_distance);

  objArrow = new Arrow(origin,objDist);

  objArrow.color = color(0);
  objArrow.draggable = false;
  objArrow.grab = false;
  objArrow.width = 4;

  objBase = createVector();


}

function draw() {
  background(180);
  objArrow.update();
  objArrow.display();



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


function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    // objArrow.add(1);
    object_distance += 1;
  } else if (keyCode == RIGHT_ARROW) {
    object_distance -= 1;
  }

  if (keyCode == UP_ARROW) {
    radius += 1;
  } else if (keyCode == DOWN_ARROW) {
    radius -= 1;
  }

  updateFocus(radius);
  updateHeight(object_height, object_distance, image_distance);
  updateDistance(focal_length, object_distance);
  pr();
  return false; // prevent default
}