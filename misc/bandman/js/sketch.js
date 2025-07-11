// --- UNCHANGED CODE AT THE TOP ---

var loc = "./data/ibm.json";
var data;
var numFrames = 20;
var startDate = new Date('2000-07-07');
var endDate = new Date("2020-05-22");
var shownValues;
var initOffset;
var initScale;
var xvals = []
var bounds = [0,0];
var jxFrame = 9;
var jx;
var displaced;
var centerY;
var gameState = 0;
var upCount = 1;
var downCount = 1;
var fallCount = 0;
// REMOVED the broken 'var frameCount = 0;'

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++ SETTING SCROLL SPEED TO BE 8x FASTER THAN ORIGINAL +++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// This is the number of frames to scroll one segment.
// Lower is much faster. Original was 16. This is now 8x faster.
var inverseFR = 4; 

var intraFrameCt;
var oldBounds = bounds;
var minH = 0.1
var playerSize = 15;
var dateNow;

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

    for (var i = 0; i <= numFrames + 1; i++){
        xvals.push(map(i, 0, numFrames, 0, windowWidth));
        currentData = data[formatDate(dateNow)]
        shownValues["upper"].push(parseFloat(currentData["Real Upper Band"]));
        shownValues["middle"].push(parseFloat(currentData["Real Middle Band"]));
        shownValues["lower"].push(parseFloat(currentData["Real Lower Band"]));
        dateNow = addDays(dateNow, 7);
    }
    
    jx = map(jxFrame - 1, 0, numFrames, 0, windowWidth);
    displaced = 0;
    fill(255,0,0);
    textSize(32);
    textAlign(CENTER, CENTER);
    intraFrameCt = 0;
    initOffset = shownValues["middle"][jxFrame - 1];
    initScale = 2 * (shownValues["upper"][jxFrame - 1] - shownValues["middle"][jxFrame - 1]);
}

function isGoingUp() {
  return keyIsDown(187) || keyIsDown(32) || mouseIsPressed;
}


// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++ CORRECTED DRAW LOOP WITH ORIGINAL PHYSICS & FIXED COUNTER +++
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++
function draw(){
    translate(0, windowHeight / 2);
    background(0);
    var yvals = [];
    for (var i = 0; i <= numFrames + 1; i++){
        var thisTop = displaced - (exp(map(shownValues["upper"][i], 0, 85, 0, 4)) + 15);
        var thisBottom = displaced + (exp(map(shownValues["lower"][i], 0, 85, 0, 4)) + 15);
        yvals.push([thisTop, thisBottom]);
    }
    
    push();
    stroke(255);
    for (var i = 0; i <= numFrames; i++){
        line(xvals[i] - (intraFrameCt + 1) * ((windowWidth / numFrames) / (inverseFR - 1)), yvals[i][0] , xvals[i+1] - (intraFrameCt + 1) * ( (windowWidth / numFrames) / (inverseFR - 1)), yvals[i+1][0]);
        line(xvals[i]- (intraFrameCt + 1) * ((windowWidth / numFrames) / (inverseFR - 1)), yvals[i][1] , xvals[i+1] - (intraFrameCt + 1) * ((windowWidth / numFrames) / (inverseFR - 1)), yvals[i+1][1]);
    }
    pop();

    var outBounds = map(intraFrameCt , 0, inverseFR - 1, yvals[jxFrame - 1][0], yvals[jxFrame][0]) >= -(playerSize / 2) || map(intraFrameCt , 0, inverseFR - 1, yvals[jxFrame - 1][1], yvals[jxFrame][1]) <= playerSize / 2;
    
    if (!outBounds){
        push();
        fill(255);
        text((floor((dateNow.getTime() - startDate.getTime()) / (1000*60*60*24*7))-22).toString(), windowWidth / 2, -(windowHeight / 2) + 30);
        pop();
        
        // Using original vertical physics, as requested
        if (isGoingUp()) { 
            displaced += 1.5 * log(upCount);
            upCount += 1;
            fallCount = 0;
        } else{
            upCount = 1;
            fallCount += 1;
        }
    
        if (keyIsDown(189)) {
            displaced -= log(downCount);
            downCount += 1;
            fallCount += 0.5;
        }else{
            downCount = 1;
        }
    
        displaced -= 0.075 * fallCount;
        push();
        noStroke();
        ellipse(jx, 0, playerSize, playerSize);
        pop();
    }else{
        gameOver(yvals);
    }

    intraFrameCt ++;

    // Using the BUILT-IN p5.js 'frameCount' which increments automatically and correctly.
    if ((frameCount % inverseFR == 0) && !outBounds && (frameCount > 0)){ 
        intraFrameCt = 0;
        do {
            dateNow = addDays(dateNow, 1);
        
        }while ((dateNow <= endDate) && (! (formatDate(dateNow) in data) ));
 
        currentData = data[formatDate(dateNow)]
        shownValues["upper"].push(parseFloat(currentData["Real Upper Band"]));
        shownValues["middle"].push(parseFloat(currentData["Real Middle Band"]));
        shownValues["lower"].push(parseFloat(currentData["Real Lower Band"]));
        
        shownValues["upper"].shift();
        shownValues["middle"].shift();
        shownValues["lower"].shift();

        if (dateNow > endDate) {
            console.log("End of demo");
            gameOver(yvals);
        }
        // REMOVED the broken 'frameCount++' that was here.
    }  
}

// --- UNCHANGED CODE AT THE BOTTOM ---

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

function gameOver(yvals) {
    background(255,0,0);
    push();
    fill(255);
    textSize(60);
    text((floor((dateNow.getTime() - startDate.getTime()) / (1000*60*60*24*7))-22).toString(), windowWidth / 2, 0)
    pop();

    push();
    stroke(255);
    for (var i = 0; i <= numFrames; i++){
        line(xvals[i] - (intraFrameCt + 1) * ((windowWidth / numFrames) / (inverseFR - 1)), yvals[i][0] , xvals[i+1] - (intraFrameCt + 1) * ( (windowWidth / numFrames) / (inverseFR - 1)), yvals[i+1][0]);
        line(xvals[i]- (intraFrameCt + 1) * ((windowWidth / numFrames) / (inverseFR - 1)), yvals[i][1] , xvals[i+1] - (intraFrameCt + 1) * ((windowWidth / numFrames) / (inverseFR - 1)), yvals[i+1][1]);
    }
    pop();
    
    push()
    noStroke();
    fill(255);
    ellipse(jx, 0, playerSize, playerSize);
    pop();
    console.log(startDate.toString());
    console.log(dateNow.toString());
    noLoop();
}