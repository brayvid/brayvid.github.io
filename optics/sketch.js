var lensCenter;
var focalLength;

var objectArrow;
var imageArrow;

var t = 1;

function preload() {
    lens = loadImage("img/lens1.svg");
    eye = loadImage("img/eye.png");
    candle = loadImage("img/candle.svg");
}

function setup() {
    frameRate(120);
    createCanvas(windowWidth, windowHeight);
    imageMode(CENTER);

    focalSlider = createSlider(100, 500, floor(random(250, 500)));
    focalSlider.position(width / 2 - 77, height / 2 - 9);
    focalSlider.style('width', '150px');

    lensCenter = createVector(width / 2, height / 2);
    focalLength = createVector(focalSlider.value(), 0);

    objectArrow = new Arrow(createVector(round(width / 4), lensCenter.y), createVector(round(random(100,width/4)), round(random(100, height/2 - 100))));
    objectArrow.color = color(200, 0, 0);
    objectArrow.draggable = false;
    objectArrow.grab = true;

    imageArrow = new Arrow(objectArrow.origin, objectArrow.target);
    imageArrow.draggable = false;
    imageArrow.grab = false;
}

function draw() {
    // Environment
    background(255);
    image(lens, width / 2, height / 2, (width / 30) / (.005 * focalSlider.value()), 6 * height / 7);
    image(eye, width - 25, height / 2, width/8, width/8);
    noFill();
    stroke(0);
    line(0, height / 2, width - 50, height / 2);

    // push();
    // textAlign(CENTER);
    // fill(0);
    // noStroke();
    // textSize(14);
    // text('Thin Convex Lens Ray Diagram', lensCenter.x,30);
    // pop();

    push();
    stroke('rgba(0,0,0,0.3)');
    line(lensCenter.x, height / 14, lensCenter.x, 13 * height / 14);
    pop();

    // push();
    // stroke('rgba(0,0,0,0.1)');
    // strokeWeight(2);
    // noFill();
    // ellipse(lensCenter.x,lensCenter.y,150,150);
    // pop();

    // push();
    // strokeWeight(3);
    // stroke(255,0,0);
    // fill('rgba(255,0,0,0.05)');
    // rect(20,20,lensCenter.x-20,height-40);
    // pop();

    // ellipse(lensCenter.x,lensCenter.y,5,5);

    focalLength = createVector(round(focalSlider.value() / 2), 0);
    drawFocalPoints();
    drawArrows();
    drawRays();
    displayValues();
    t++;

    // if(dist(mouseX,mouseY,objectArrow.target.x,objectArrow.target.y)<=15){
    //     push();
    //     fill('rgba(0,0,0,0.1)')
    //     ellipse(objectArrow.target.x,objectArrow.target.y,30,30);
    //     pop();
    // }
}

function drawRays() {
    push();
    stroke(0);
    strokeWeight(1);
    if (lensCenter.x - objectArrow.target.x - focalLength.x > 0.6) {
        imageArrow.color = color('rgba(200,0,50,0.95)');
        line(objectArrow.target.x, objectArrow.target.y, imageArrow.target.x, imageArrow.target.y);
        line(objectArrow.target.x, objectArrow.target.y, lensCenter.x, objectArrow.target.y);
        line(lensCenter.x, objectArrow.target.y, imageArrow.target.x, imageArrow.target.y);
        // line(objectArrow.target.x, objectArrow.target.y, lensCenter.x, imageArrow.target.y);
        // line(lensCenter.x, imageArrow.target.y, imageArrow.target.x, imageArrow.target.y);
    }

    if (lensCenter.x - objectArrow.target.x < focalLength.x && objectArrow.target.x < lensCenter.x) {
        imageArrow.color = color('rgba(200,0,0,0.2)');

        for (var i = 0; i <= round(dist(imageArrow.target.x,imageArrow.target.y,objectArrow.target.y,objectArrow.target.y)); i=i+10) {
            var x = lerp(imageArrow.target.x, objectArrow.target.x, i / round(dist(imageArrow.target.x,imageArrow.target.y,objectArrow.target.y,objectArrow.target.y)));
            var y = lerp(imageArrow.target.y, objectArrow.target.y, i / round(dist(imageArrow.target.x,imageArrow.target.y,objectArrow.target.y,objectArrow.target.y)));
            ellipse(x, y, 1, 1);
        }
        line(objectArrow.target.x,objectArrow.target.y,lensCenter.x,lensCenter.y);
        line(objectArrow.target.x,objectArrow.target.y,lensCenter.x,objectArrow.target.y);
        line(lensCenter.x,objectArrow.target.y,lensCenter.x+focalLength.x,lensCenter.y);
        for (var i = 0; i <= round(dist(imageArrow.target.x,imageArrow.target.y,lensCenter.x,objectArrow.target.y)); i=i+10) {
            var x = lerp(imageArrow.target.x, lensCenter.x, i / round(dist(imageArrow.target.x,imageArrow.target.y,lensCenter.x,objectArrow.target.y)));
            var y = lerp(imageArrow.target.y, objectArrow.target.y, i / round(dist(imageArrow.target.x,imageArrow.target.y,lensCenter.x,objectArrow.target.y)));
            ellipse(x, y, 1, 1);
        }

        // for (var i = 0; i <= 50; i++) {
        //     var x = lerp(imageArrow.target.x, lensCenter.x, i / 50.0);
        //     var y = lerp(imageArrow.target.y, imageArrow.target.y, i / 50.0);
        //     ellipse(x, y, 2, 2);
        // }


    }
       pop();
}

function displayValues() {
    push();
        noStroke();
        textAlign(CENTER);
        fill(0);
        var leftBorder = 40;
        var rightBorder = width - 40;
        var topBorder = 40;
        var bottomBorder = height - 40;

        // Focal length 
        push();
        textSize(16);
        fill(0);
        text('f', lensCenter.x, lensCenter.y - 10);
        text(focalLength.x, lensCenter.x, lensCenter.y + 25);
        pop();

        if (objectArrow.target.y <= lensCenter.y) {
            text('Object height', objectArrow.target.x, objectArrow.target.y - 50);
            text(lensCenter.y - objectArrow.target.y, objectArrow.target.x, objectArrow.target.y - 30);
            text('Object distance', objectArrow.target.x, lensCenter.y + 15);
            text(round(lensCenter.x - objectArrow.target.x), objectArrow.target.x, lensCenter.y + 35);
        } else {
            text('Object height', objectArrow.target.x, objectArrow.target.y + 30);
            text(lensCenter.y - objectArrow.target.y, objectArrow.target.x, objectArrow.target.y + 50);
            text('Object distance', objectArrow.target.x, lensCenter.y - 15);
            text(round(lensCenter.x - objectArrow.target.x), objectArrow.target.x, lensCenter.y - 35);
        }

        if (imageArrow.target.y < lensCenter.y && abs(lensCenter.x-objectArrow.target.x-focalLength.x)>0.6) {
            // on top
            text('Image height', constrain(imageArrow.target.x, leftBorder, rightBorder), constrain(imageArrow.target.y - 50, topBorder, bottomBorder));
            text(round(lensCenter.y - imageArrow.target.y), constrain(imageArrow.target.x, leftBorder, rightBorder), constrain(imageArrow.target.y - 30, topBorder + 20, bottomBorder));
            text('Image distance', constrain(imageArrow.target.x, leftBorder, rightBorder), constrain(lensCenter.y + 15, topBorder, bottomBorder));
            text(-1*abs(round(lensCenter.x - imageArrow.target.x)), constrain(imageArrow.target.x, leftBorder, rightBorder), constrain(lensCenter.y + 35, topBorder + 20, bottomBorder));
        } else if(imageArrow.target.y > lensCenter.y && abs(lensCenter.x-objectArrow.target.x-focalLength.x)>0.6){// on bottom
                text('Image height', constrain(imageArrow.target.x, leftBorder, rightBorder), constrain(imageArrow.target.y + 15, topBorder, bottomBorder - 20));
                text(round(lensCenter.y - imageArrow.target.y), constrain(imageArrow.target.x, leftBorder, rightBorder), constrain(imageArrow.target.y + 35, topBorder, bottomBorder));
                text('Image distance', constrain(imageArrow.target.x, leftBorder, rightBorder), constrain(lensCenter.y - 15, topBorder, bottomBorder));
                text(-1*round(lensCenter.x - imageArrow.target.x), constrain(imageArrow.target.x, leftBorder, rightBorder), constrain(lensCenter.y - 35, topBorder + 20, bottomBorder - 20));

        }else{
            push();
            textAlign(CENTER);
            textSize(16);
            fill('rgba(200,50,50,0.5)');
            text('NO IMAGE', lensCenter.x,height-9);
            pop();

        }


        // Compare object dist and focal length: greater, less or equal
        push();
            textAlign(CENTER);
              text('Object distance',lensCenter.x-55,height-50);
              text('Focal length',lensCenter.x+48,height-50);
            if(lensCenter.x-objectArrow.target.x + 0.5 < focalLength.x && objectArrow.target.x < lensCenter.x){
              text('<',lensCenter.x,height-50);
            }else if(lensCenter.x-objectArrow.target.x  - 0.5 > focalLength.x && objectArrow.target.x < lensCenter.x){
              text('>',lensCenter.x,height-50);
            }else if(abs(lensCenter.x-objectArrow.target.x-focalLength.x)<0.6){
                // EFFECTIVELY EQUAL
              text('=',lensCenter.x,height-50);
            }

            text('Magnification: ', lensCenter.x-20, height - 30);
            if(abs(lensCenter.x-objectArrow.target.x-focalLength.x)>0.6){
                text(round(10*(abs(imageArrow.target.y-imageArrow.origin.y)/abs(objectArrow.origin.y-objectArrow.target.y)))/10,lensCenter.x+40,height-30);
            }else{
                text('Infinite',lensCenter.x+40,height-30);
            }

            if(abs(lensCenter.x-focalLength.x-objectArrow.target.x) < 0.6){
                
            }else if(objectArrow.target.x < lensCenter.x-focalLength.x){
                text('Real image',lensCenter.x,height-10);
            }else if(objectArrow.target.x > lensCenter.x-focalLength.x){
                text('Virtual image',lensCenter.x,height-10);
            }else{
                
            }
        pop();


    pop();

}

function drawFocalPoints() {
    // RIGHT
    push();
    strokeWeight(2);
    line(lensCenter.x + focalLength.x, lensCenter.y - 10, lensCenter.x + focalLength.x, lensCenter.y + 10);
    // LEFT
    line(lensCenter.x - focalLength.x, lensCenter.y - 10, lensCenter.x - focalLength.x, lensCenter.y + 10);
    pop();
}


function drawArrows() {


    objectArrow.update();
    // FIX ARROW ORIGINS TO HORIZONTAL AXIS
    objectArrow.origin = {
        x: objectArrow.target.x,
        y: lensCenter.y
    };
    imageArrow.origin = {
        x: imageArrow.target.x,
        y: lensCenter.y
    };
    // RECALCULATE IMAGE POSITION
    imageArrow.target = newImagePosition(focalLength.x, lensCenter.x - objectArrow.target.x, lensCenter.y - objectArrow.target.y);
    imageArrow.update();
    

    
    // CONSTRAIN OBJECT TO LEFT SIDE OF LENS
    if (objectArrow.target.x >= lensCenter.x - 1) {
        objectArrow.target.x = lensCenter.x - 1;
    }
    if (objectArrow.target.x <= 20) {
        objectArrow.target.x = 20;
    }
    if (objectArrow.target.y <= 20) {
        objectArrow.target.y = 20;
    }
    if (objectArrow.target.y >= height - 20) {
        objectArrow.target.y = height - 20;
    }

    if(abs(objectArrow.target.x - (lensCenter.x-focalLength.x)) < 4 && !keyIsDown(LEFT_ARROW) && !keyIsDown(RIGHT_ARROW) && t%3==0){
        objectArrow.target.x = lensCenter.x - focalLength.x;
    }
    if(t%2==0){
     if (keyIsDown(LEFT_ARROW)){
         objectArrow.target.x -= 2;
     }
      if (keyIsDown(RIGHT_ARROW)){   
       objectArrow.target.x += 2;
        }

      if (keyIsDown(UP_ARROW)){
        objectArrow.target.y -= 2;
         }
      if (keyIsDown(DOWN_ARROW)){
        objectArrow.target.y += 2;
        }
    }
    
    // CANDLES
    push();
    imageMode(CENTER);
    // Object
    translate(objectArrow.target.x,(objectArrow.target.y+lensCenter.y)/2);
    if(objectArrow.target.y > lensCenter.y){rotate(PI);}
    image(candle,0,0,(lensCenter.y-objectArrow.target.y)/5,lensCenter.y-objectArrow.target.y);
    // Image
    pop();

    push();
    imageMode(CENTER);
    translate(imageArrow.target.x,(imageArrow.target.y+lensCenter.y)/2);
    // TEST CASES FOR ORIENTATION
    if(imageArrow.target.x < lensCenter.x && lensCenter.x-focalLength.x>objectArrow.target.x){rotate(PI);}
    if(imageArrow.target.y > lensCenter.y  && ! lensCenter.x-focalLength.x<objectArrow.target.x){rotate(PI);}
    
    image(candle,0,0,(lensCenter.y-imageArrow.target.y)/5,lensCenter.y-imageArrow.target.y);
    pop();

  
    // objectArrow.display();
    // imageArrow.display();
}

function newImagePosition(f, o, oh) {
    // LENS FORMULA
    if (o != f) {
        var x = o * f / (o - f);
    } else {
        var x = 999999;
    }
    if (o != 0) {
        var y = x * oh / o;
    } else {
        var y = 999999;
    }
    return createVector(lensCenter.x + x, lensCenter.y + y);

}

function mouseDragged(){
    // ONLY ALLOW TOUCHES ON LEFT SIDE OF LENS, AVOID SLIDER, & AVOID AXIS
    
    if(dist(mouseX,mouseY,lensCenter.x,lensCenter.y)>75 && mouseX < lensCenter.x && mouseY != lensCenter.y){
        objectArrow.target.x = mouseX;
        objectArrow.target.y = mouseY;
    }
}
function mousePressed(){
    // ONLY ALLOW TOUCHES ON LEFT SIDE OF LENS, AVOID SLIDER, & AVOID AXIS
    
    if(dist(mouseX,mouseY,lensCenter.x,lensCenter.y)>75 && mouseX < lensCenter.x && mouseY != lensCenter.y){
        objectArrow.target.x = mouseX;
        objectArrow.target.y = mouseY;
    }
}

// function touchStarted(){
//     return false;
// }

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    image(lens, width / 2, height / 2);
    focalSlider.position(width / 2 - 77, height / 2 - 9);
    lensCenter.x = width / 2;
    lensCenter.y = height / 2;
}
