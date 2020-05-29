var loc = "./data/ibm.json";
var data;
var numFrames = 20;
var startDate = new Date('2000-07-07');
var endDate = new Date("2020-05-22");
var shownValues;
var xvals = []
var bounds = [0,0];
var jxFrame = 2;
var jx;
var jy;
var centerY;
var gameState = 0;
var upCount = 1;
var downCount = 1;
var frameCount = 0;

function preload(){
    data = ibm_data["Technical Analysis: BBANDS"];
}

function setup(){
    frameRate(60);
    createCanvas(windowWidth, windowHeight);
    background(0);
    
    shownValues = {
        "upper" : [],
        "middle": [],
        "lower": []
    }

    dateNow = addDays(startDate, 1);

    for (var i = 0; i < numFrames; i++){
        xvals.push(map(i, 0, numFrames - 1, 0, windowWidth));
        // console.log(formatDate(dateNow));
        currentData = data[formatDate(dateNow)]
        shownValues["upper"].push(parseFloat(currentData["Real Upper Band"]));
        shownValues["middle"].push(parseFloat(currentData["Real Middle Band"]));
        shownValues["lower"].push(parseFloat(currentData["Real Lower Band"]));
        dateNow = addDays(dateNow, 7);
    }

    // console.log(shownValues);

    bounds[0] = min(shownValues["lower"]);
    bounds[1] = max(shownValues["upper"]);
    centerY = (bounds[0] + bounds[1]) / 2;
    // console.log(bounds);
    jx = map(jxFrame, 0, numFrames, 0, windowWidth);
    jy = (((windowHeight / 2) - map(shownValues["upper"][0] - centerY , 0 , bounds[1] - centerY , 0 , windowHeight / 3)) + ((windowHeight / 2) + map(centerY - shownValues["lower"][0], 0 , bounds[1] - centerY , 0 , windowHeight / 3))) / 2
    
    stroke(255);
    fill(255,0,0);
    textSize(32);
    textAlign(CENTER, CENTER);
}

function draw(){

    var outBounds = (jy <= (windowHeight / 2) - map(shownValues["upper"][jxFrame] - centerY , 0 , bounds[1] - centerY , 0 , windowHeight / 3)) || (jy >= (windowHeight / 2) + map(centerY - shownValues["lower"][jxFrame], 0 , bounds[1] - centerY , 0 , windowHeight / 3));
    
    if (!outBounds){
        background(0);

        push();
        fill(255);
        text(floor(frameCount / 4).toString(), windowWidth / 2, 30)
        pop();

        if (keyIsDown(UP_ARROW)) {
            jy -= log(upCount);
            upCount += 1;
            // console.log("UP")
        } else{
            upCount = 1;
        }
    
        if (keyIsDown(DOWN_ARROW)) {
            jy += log(downCount);
            downCount += 1;
            // console.log("DOWN")
        }else{
            downCount = 1;
        }
    
        jy += 1;

    }else {
        background(255,0,0);
        fill(255);
        textSize(60);
        text(floor(frameCount / 4).toString(), windowWidth / 2, windowHeight / 2)
        noLoop();
    }

    push();
    noStroke();
    ellipse(jx, jy, 15,15);
    pop();

    centerY = (bounds[0] + bounds[1]) / 2;

    for (var i = 0; i < numFrames - 1; i++){
        
        u0 = (windowHeight / 2) - map(shownValues["upper"][i] - centerY , 0 , bounds[1] - centerY , 0 , windowHeight / 3)
        u1 = (windowHeight / 2) - map(shownValues["upper"][i+1] - centerY , 0 , bounds[1] - centerY , 0 , windowHeight / 3)

        line(xvals[i], u0 , xvals[i+1], u1);

        l0 = (windowHeight / 2) + map(centerY - shownValues["lower"][i], 0 , bounds[1] - centerY , 0 , windowHeight / 3)
        l1 = (windowHeight / 2) + map(centerY - shownValues["lower"][i+1], 0 , bounds[1] - centerY , 0 , windowHeight / 3)

        line(xvals[i], l0 , xvals[i+1], l1);
    }


    if ((frameCount % 16 == 0) && ! outBounds){
        
        do {
            dateNow = addDays(dateNow, 1);
            // console.log(formatDate(dateNow))
        }while ((dateNow <= endDate) && (! (formatDate(dateNow) in data) ));
        // console.log(formatDate(dateNow));
        currentData = data[formatDate(dateNow)]
        shownValues["upper"].push(parseFloat(currentData["Real Upper Band"]));
        shownValues["middle"].push(parseFloat(currentData["Real Middle Band"]));
        shownValues["lower"].push(parseFloat(currentData["Real Lower Band"]));
        
        shownValues["upper"].shift();
        shownValues["middle"].shift();
        shownValues["lower"].shift();

        bounds[0] = min(shownValues["lower"]);
        bounds[1] = max(shownValues["upper"]);


        if (dateNow > endDate) {
            console.log("End of demo");
            noLoop();
        }

        frameCount ++;   
    }
    
}

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}