// HTML elements
var initialAmountTitle, initialAmountSlider, interestRateTitle, interestRateSlider, annualDepositTitle, annualDepositSlider, timeScaleTitle, timeScaleSlider, autoScaleButton;

// Stores balances for each timestep
var balances = [];

// Initial vertical scale of the graph
var maxBalance  = 1000000;

// Holds graph dimensions 
var graph;

// p5 function - runs once on start
function setup() {

  // 
  createCanvas(windowWidth, windowHeight);
  frameRate(60);
  textFont("Georgia");

  // Set up HTML elements
  initialAmountTitle = createElement('h2', 'Initial deposit: $1000');
  initialAmountTitle.position(30, 10);
  initialAmountSlider = createSlider(0,5000,1000,100);
  initialAmountSlider.size(300);
  initialAmountSlider.position(30,60);
  initialAmountSlider.input(updateInitialAmountTitle);

  interestRateTitle = createElement('h2', 'Interest rate: 2%');
  interestRateTitle.position(30, 150);
  interestRateSlider = createSlider(1,5,2,0.1);
  interestRateSlider.size(300);
  interestRateSlider.position(30,200);
  interestRateSlider.input(updateInterestRateTitle);

  annualDepositTitle = createElement('h2', 'Annual deposit: $1500');
  annualDepositTitle.position(30, 300);
  annualDepositSlider = createSlider(0,5000,1500,100);
  annualDepositSlider.size(300);
  annualDepositSlider.position(30,350);
  annualDepositSlider.input(updateAnnualDepositTitle);

  timeScaleTitle = createElement('h3', 'Timescale: 50 years');
  timeScaleTitle.position(395, 100);
  timeScaleSlider = createSlider(20,90,50,1);
  timeScaleSlider.size(200);
  timeScaleSlider.position(375,85);
  timeScaleSlider.input(updatetimeScaleTitle);

  autoScaleButton = createButton('Scale');
  autoScaleButton.position(375,20);
  autoScaleButton.size(100,40);
  autoScaleButton.mousePressed(reScale);

  // Graph size tied to window size
  graph = {
    top: 20,
    bottom: height-25,
    left: 350,
    right: width
  }

  // Calculate initial balances
  newCurve();
}

// p5 function - runs x times per second based on frameRate()
function draw(){

  // Wipe canvas
  background(255);

  // Graph borders
  line(graph.left,0,graph.left,graph.bottom);
  line(graph.left,graph.bottom,width,graph.bottom);

  // Graph labels
  push();
  textAlign(RIGHT);
  textSize(14);
  text(round((balances.length)) + ' years',graph.right-5,graph.bottom-5);
  textSize(22);
  text('End balance: $' + round(balances[balances.length-1]),(graph.left+graph.right)/2 + 100,graph.top+25);
  pop();

  // Draw circles at locations within the graph dimensions, mapped from the 'balances' data
  push();
  noStroke();
  fill(50);
  textAlign(CENTER);
  for(var i = 0; i < balances.length; i++){
    if(i == 0){
      push();
      translate(map(i,0,timeScaleSlider.value(),graph.left,graph.right),map(balances[i],initialAmountSlider.value(),maxBalance,graph.bottom,graph.top));
      ellipse(0,0,4,4);
      pop();
    }else{
      if(i % 10 == 0){
        push();
        translate(map(i,0,timeScaleSlider.value(),graph.left,graph.right),map(balances[i],initialAmountSlider.value(),maxBalance,graph.bottom,graph.top));
        ellipse(0,0,8,8);
        text(i + ' years',-10,-20);
        text('$'+round(balances[i]),-10,-10);
        pop();
      }else{
        ellipse(map(i,0,timeScaleSlider.value(),graph.left,graph.right),map(balances[i],initialAmountSlider.value(),maxBalance,graph.bottom,graph.top),4,4);
      }
    } 
  }
  pop();
}

// Calculate balances for each timestep and overwrite old balances array
function newCurve(){
  balances = [];
  var tempBalance = 0;
  var year = 0;
  for(var t = 0; t < timeScaleSlider.value(); t++){
    year = t;
    tempBalance = ((Math.exp((interestRateSlider.value()/100)*year)*(initialAmountSlider.value()*(interestRateSlider.value()/100)+annualDepositSlider.value()))-annualDepositSlider.value())/(interestRateSlider.value()/100);
    balances.push(tempBalance);
  }
}

// 'update' functions run whenever there is slider input
function updateInitialAmountTitle(){
  initialAmountTitle.html('Initial deposit: $'+initialAmountSlider.value());
  newCurve();
}

function updateInterestRateTitle(){
  interestRateTitle.html('Interest rate: '+interestRateSlider.value()+'%');
  newCurve();
}

function updateAnnualDepositTitle(){
  annualDepositTitle.html('Annual deposit: $'+annualDepositSlider.value());
  newCurve();
}

function updatetimeScaleTitle(){
  timeScaleTitle.html('Timescale: '+timeScaleSlider.value() + ' years');
  newCurve();
}

// Make the final data point lie at the top right corner of the graph
function reScale(){
  maxBalance = balances[balances.length - 1];
}


// p5 function - adjust canvas size and graph size based on the window
function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  graph = {
    top: 20,
    bottom: height-25,
    left: 350,
    right: width
  }
}
