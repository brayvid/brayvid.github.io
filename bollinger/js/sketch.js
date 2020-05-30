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
var frameCount = 0;
var inverseFR = 16;
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
        // console.log(formatDate(dateNow));
        currentData = data[formatDate(dateNow)]
        shownValues["upper"].push(parseFloat(currentData["Real Upper Band"]));
        shownValues["middle"].push(parseFloat(currentData["Real Middle Band"]));
        shownValues["lower"].push(parseFloat(currentData["Real Lower Band"]));
        dateNow = addDays(dateNow, 7);
    }

    // console.log(shownValues);

    // bounds[0] = min(shownValues["lower"]);
    // bounds[1] = max(shownValues["upper"]);
    // oldBounds = bounds;
    
    // centerY = (bounds[0] + bounds[1]) / 2;
    // console.log(bounds);
    jx = map(jxFrame - 1, 0, numFrames, 0, windowWidth);
    displaced = 0;
    fill(255,0,0);
    textSize(32);
    textAlign(CENTER, CENTER);
    intraFrameCt = 0;
    initOffset = shownValues["middle"][jxFrame - 1];
    initScale = 2 * (shownValues["upper"][jxFrame - 1] - shownValues["middle"][jxFrame - 1]);
}

function draw(){
    translate(0, windowHeight / 2);
    background(0);
    var yvals = [];
    for (var i = 0; i <= numFrames + 1; i++){

        var thisH = 2 * (shownValues["upper"][i] - shownValues["middle"][i]);
        
        // centerY0 = map(i, 0 , numFrames - 2, (oldBounds[0] + oldBounds[1]) / 2 , (bounds[0] + bounds[1]) / 2);
        // centerY1 = map(i + 1, 0 , numFrames - 2, (oldBounds[0] + oldBounds[1]) / 2 , (bounds[0] + bounds[1]) / 2);

        // u0.push((windowHeight / 2) - map(shownValues["upper"][i] - centerY0 , 0 , bounds[1] - centerY , 0 , windowHeight / 2)  - displaced);
        // u1.push((windowHeight / 2) - map(shownValues["upper"][i+1] - centerY1 , 0 , bounds[1] - centerY , 0 , windowHeight / 2)  - displaced);        

        // l0.push((windowHeight / 2) + map(centerY - shownValues["lower"][i], 0 , centerY0 - bounds[0] , 0 , windowHeight / 2)  - displaced);
        // l1.push((windowHeight / 2) + map(centerY - shownValues["lower"][i+1], 0 , centerY1 - bounds[0] , 0 , windowHeight / 2)  - displaced)
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

// (intraFrameCt + 1) * ((windowWidth / numFrames) / (inverseFR - 1))
    var outBounds = map(intraFrameCt , 0, inverseFR - 1, yvals[jxFrame - 1][0], yvals[jxFrame][0]) >= -(playerSize / 2) || map(intraFrameCt , 0, inverseFR - 1, yvals[jxFrame - 1][1], yvals[jxFrame][1]) <= playerSize / 2;
     // var outBounds = false;
    
    if (!outBounds){
        // background(0);

        push();
        fill(255);
        text((floor((dateNow.getTime() - startDate.getTime()) / (1000*60*60*24*7))-22).toString(), windowWidth / 2, -(windowHeight / 2) + 30);
        pop();

        if (keyIsDown(187)) {
            displaced += 1.5 * log(upCount);
            upCount += 1;
            fallCount = 0;
            // console.log("UP")
        } else{
            upCount = 1;
            fallCount += 1;
        }
    
        if (keyIsDown(189)) {
            displaced -= log(downCount);
            downCount += 1;
            // fallCount = 0;
            // console.log("DOWN")
        }else{
            downCount = 1;
            fallCount += 0.5;
        }
    
        displaced -= 0.075 * fallCount;
        push();
        noStroke();
        ellipse(jx, 0, playerSize, playerSize);
        pop();
    }else{
        gameOver(yvals);
    }
    // oldBounds = bounds;
    // bounds[0] = min(shownValues["lower"]);
    // bounds[1] = max(shownValues["upper"]);
    // centerY = (bounds[0] + bounds[1]) / 2;

    // centerY = (bounds[0] + bounds[1]) / 2;



    intraFrameCt ++;

    if ((frameCount % inverseFR == 0) && ! outBounds && (frameCount > 0)){ 
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