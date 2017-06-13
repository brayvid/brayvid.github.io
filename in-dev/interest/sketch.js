var initialAmountTitle, initialAmountSlider, interestRateTitle, interestRateSlider, annualDepositTitle, annualDepositSlider;
var balances = [];


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

  newCurve();
}

function draw(){
  background(255);
  line(350,0,350,400);
  line(350,400,width,400);
  push();
  textSize(14);
  textFont("Georgia");
  text('years',width-35,395);
  text('$',355,15);
  pop();

  for(var i = 0; i < balances.length; i++){
    ellipse(map(i,0,400,350,width),map(balances[i],0,10000000,400,0),4,4);
  }

}


function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
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

function newCurve(){
  balances = [];
  var tempBalance = 0;
  var year = 0;
  for(var t = 0; t < 400; t++){
    year = t/4;
    tempBalance = ((Math.exp((interestRateSlider.value()/100)*year)*(initialAmountSlider.value()*(interestRateSlider.value()/100)+annualDepositSlider.value()))-annualDepositSlider.value())/(interestRateSlider.value()/100);
    balances.push(tempBalance);
  }
}