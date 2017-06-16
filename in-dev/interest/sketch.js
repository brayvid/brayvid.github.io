var initialAmountTitle, initialAmountSlider, interestRateTitle, interestRateSlider, annualDepositTitle, annualDepositSlider, scaleSlider;
var balances = [];

var graph, timeScale;


function setup() {
  createCanvas(windowWidth, windowHeight);

  initialAmountTitle = createElement('h2', 'Initial deposit: $1000');
  initialAmountTitle.position(30, 10);
  initialAmountSlider = createSlider(0,5000,1000,500);
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
  annualDepositSlider = createSlider(0,5000,1500,500);
  annualDepositSlider.size(300);
  annualDepositSlider.position(30,350);
  annualDepositSlider.input(updateAnnualDepositTitle);

  scaleTitle = createElement('h3', 'Timescale: 50 years');
  scaleTitle.position(width-200, 395);
  scaleSlider = createSlider(20,80,50,5);
  scaleSlider.size(200);
  scaleSlider.position(width-220,380);
  scaleSlider.input(updateScaleTitle);

  graph = {
    top: 20,
    bottom: 375,
    left: 350,
    right: width
  }


  newCurve();
}

function draw(){
  background(255);
  line(graph.left,0,graph.left,graph.bottom);
  line(graph.left,graph.bottom,width,graph.bottom);
  push();
  textAlign(RIGHT);
  textSize(14);
  textFont("Georgia");
  text(round((balances.length)) + ' years',graph.right-5,graph.bottom-5);
  text('$' + round(balances[balances.length-1]),graph.right-5,graph.top-8);
  pop();

  var linePosition;
  for(var i = 0; i < round(balances[balances.length-1]/1000); i++){
    linePosition = 
    line(graph.left,linePosition,graph.right,linePosition);
  }

  push();
  noStroke();
  fill(50);
  for(var i = 0; i < balances.length; i++){
    if(i % 10 == 0){
      push();
      translate(map(i,0,scaleSlider.value(),graph.left,graph.right),map(balances[i],initialAmountSlider.value(),balances[balances.length-1],graph.bottom,graph.top));
      fill(50);
      ellipse(0,0,8,8);
      textAlign(CENTER);
      text(i + ' years',-10,-20);
      text('$'+round(balances[i]),-10,-10);
      pop();
    }else{
      ellipse(map(i,0,scaleSlider.value(),graph.left,graph.right),map(balances[i],initialAmountSlider.value(),balances[balances.length-1],graph.bottom,graph.top),4,4);
    }
  }
  pop();

}


function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
  graph = {
    top: 20,
    bottom: 375,
    left: 350,
    right: width
  }
}

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

function updateScaleTitle(){
  scaleTitle.html('Timescale: '+scaleSlider.value() + ' years');
  newCurve();
}

function newCurve(){
  balances = [];
  var tempBalance = 0;
  var year = 0;
  for(var t = 0; t < scaleSlider.value(); t++){
    year = t;
    tempBalance = ((Math.exp((interestRateSlider.value()/100)*year)*(initialAmountSlider.value()*(interestRateSlider.value()/100)+annualDepositSlider.value()))-annualDepositSlider.value())/(interestRateSlider.value()/100);
    balances.push(tempBalance);
  }
}