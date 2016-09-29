var object_height = 10;
var object_distance;

var image_height;
var image_distance;

var radius;
var focal_length;






function setup(){
	frameRate(0.5);
	createCanvas(600,400);
	object_distance = 50;
	radius = 35;

	image_height = 1;
	image_distance = 1;
	focal_length = 1;
	
}

function draw(){


	
	pr();


}

	function updateFocus(r){
		focal_length = r / 2;
	}

	function updateHeight(oh, od, id){
		// 	h'/h = -s'/s
		if(od != 0){
			image_height = (-1*oh*id)/od;
			}
	}

	function updateDistance(f, s){
		if (f != s){
			image_distance = (f*s)/(s-f);
		}
	}


	function pr(){
		console.log("image distance: " + image_distance);
		console.log("image height: " + image_height );
		console.log("object_distance: " + object_distance );
		console.log("object_height :" + object_height);
		console.log("focal length :" + focal_length );
	}


		function keyPressed() {
		  if (keyCode == LEFT_ARROW) {
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
		updateDistance(focal_length, image_distance);
		  return false; // prevent default
	}