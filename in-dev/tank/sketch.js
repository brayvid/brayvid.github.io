var poundsSaltInTank,
    concentrationIn,
    waterFlowRate,
    saltRateIn,
    saltRateOut,
    tankVolume,
    overallSaltRate,
    timeCounter,
    beginSwitch,
    maxTime,
    maxSaltAmount;

var saltAmountHistory = [];


function setup(){
  createCanvas(windowWidth,windowHeight);
  frameRate(60);
  ellipseMode(RADIUS);
  textAlign(CENTER);
  textSize(24);
  fill(0);

  concentrationInSlider = createSlider(0,0.5,0,0.01);
  concentrationInSlider.position(width/2-150,height-50);
  concentrationInSlider.size(300);

  /* Edit to change scale */ 
  maxTime = 2000;
  maxSaltAmount = 30;

  
  poundsSaltInTank = 25;
  waterFlowRate = 0.2;
  tankVolume = 100;

  concentrationIn = concentrationInSlider.value();
  timeCounter = 1;
  beginSwitch = 1;
  console.log("amt salt in tank: "+poundsSaltInTank);
}

function draw(){

  background(255);

  text("Pounds of salt in " + tankVolume+" gal tank",width/2,50);
  text(round(poundsSaltInTank,2) + " lbs",width/2,80);

  if(timeCounter < maxTime/15){
    text("Spacebar to pause", width/2,height/2);
  }

  push();
  textSize(14);
  text("Concentration of salt flowing in (0 - 0.5 lbs/gal)",width/2,height-20);
  pop();
  if(beginSwitch==1){
    tick();
    timeCounter++;
  }
  if(timeCounter % 60 == 0 && beginSwitch == 1){
    console.log("amt salt in tank: "+poundsSaltInTank);
  }

  for(var i = 0; i < saltAmountHistory.length;i++){
      ellipse(map(saltAmountHistory[i].time,1,maxTime,1,width), height-map(saltAmountHistory[i].amount,0,maxSaltAmount,50,height),2,2);
    }

  if(timeCounter >= maxTime){
    noLoop();
  }

}

function tick(){
   saltRateIn = concentrationInSlider.value() * waterFlowRate;
   saltRateOut = (poundsSaltInTank / tankVolume) * waterFlowRate;
   overallSaltRate = saltRateIn - saltRateOut;
   poundsSaltInTank+=overallSaltRate;
   saltAmountHistory.push({
    time: timeCounter,
    amount: poundsSaltInTank
   });
}

function keyTyped(){
  if(keyCode == 32){
    if(beginSwitch == 0){
    beginSwitch = 1;
  }else{
    beginSwitch = 0;
  }
  }
}

function widowResized(){
  resizeCanvas();
}

