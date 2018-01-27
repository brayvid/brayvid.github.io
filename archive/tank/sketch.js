var poundsSaltInTank,
    concentrationIn,
    waterFlowRate,
    saltRateIn,
    saltRateOut,
    tankVolume,
    overallSaltRate,
    timeCounter,
    titleScreen,
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

  concentrationInSlider = createSlider(0,0.25,0.125,0.025);
  concentrationInSlider.position(width/2-150,height-50);
  concentrationInSlider.size(300);
  concentrationInSlider.input(concentrationChanged);

  initialSaltSlider = createSlider(0,25,25,1);
  initialSaltSlider.position(width/4-250,height-50);
  initialSaltSlider.size(300);
  initialSaltSlider.input(saltChanged);

  /* Edit to change scale */ 
  maxTime = 800;
  maxSaltAmount = 30;

  
  poundsSaltInTank = initialSaltSlider.value();
  waterFlowRate = 0.2;
  tankVolume = 100;

  concentrationIn = concentrationInSlider.value();
  timeCounter = 1;
  titleScreen = 1;
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
  text("Concentration of salt flowing in (0 - 0.25 lbs/gal)",width/2,height-20);
  text("Initial amount of salt in tank (0-25 lbs)",width/4-110,height-20);
  pop();

  push();
  stroke(255,0,0);
  line(0,height-map(concentrationIn*tankVolume,0,maxSaltAmount,50,height),width,height-map(concentrationIn*tankVolume,0,maxSaltAmount,50,height));
  pop();

  push();
  textSize(16);
  text(round(concentrationIn*tankVolume) + " lbs",width-45, height-map(concentrationIn*tankVolume,0,maxSaltAmount,50,height)+25);
  pop();


  if(beginSwitch==1){
    tick();
    timeCounter++;
  }
  if(beginSwitch == 1){
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


function concentrationChanged(){
  concentrationIn = concentrationInSlider.value();
  poundsSaltInTank = initialSaltSlider.value();
  timeCounter = 1;
  saltAmountHistory = [];
}

function saltChanged(){
  poundsSaltInTank = initialSaltSlider.value();
  timeCounter = 1;
  saltAmountHistory = [];
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

