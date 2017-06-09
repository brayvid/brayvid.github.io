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
  

  /* Edit to change scale */ 
  maxTime = 1000;
  maxSaltAmount = 25;


  /* Edit initial conditions */
  poundsSaltInTank = 25;
  concentrationIn = 0.1;
  waterFlowRate = 0.25;
  tankVolume = 100;


  timeCounter = 1;
  beginSwitch = 1;
  console.log("amt salt in tank: "+poundsSaltInTank);
}

function draw(){

  background(255);

  text("Pounds of salt in tank vs. time",width/2,50);

  if(beginSwitch==1){
    tick();
    timeCounter++;
  }
  if(timeCounter % 60 == 0 && beginSwitch == 1){
    console.log("amt salt in tank: "+poundsSaltInTank);
  }

  for(var i = 0; i < saltAmountHistory.length;i++){
      ellipse(map(saltAmountHistory[i].time,1,1000,1,width), height-map(saltAmountHistory[i].amount,0,25,0,height),2,2);
    }

  if(timeCounter >= 1000){
    noLoop();
  }

}


function tick(){
   saltRateIn = concentrationIn * waterFlowRate;
   saltRateOut = (poundsSaltInTank / tankVolume) * waterFlowRate;
   overallSaltRate = saltRateIn - saltRateOut;
   poundsSaltInTank+=overallSaltRate;
   saltAmountHistory.push({
    time: timeCounter,
    amount: poundsSaltInTank
   });
}


function touchStarted(){
  if(beginSwitch == 0){
    beginSwitch = 1;
  }else{
    beginSwitch = 0;
  }
}


// function touchStarted(){
//   if(beginSwitch == 0){
//     beginSwitch = 1;
//   }else{
//     beginSwitch = 0;
//   }
// }

function widowResized(){
  resizeCanvas();
}

