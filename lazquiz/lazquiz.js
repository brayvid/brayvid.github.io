// *Final exam not ready*
// *Equations/add'l info not ready*

// Structure: JPEG } p5.image }} Array }} exams
var exams = {
  one: [],
  two: [],
  three: [],
  final: []
};

var data = [];

//  Selected through drop-down (1, 2, 3 or 4)
var activeExam = 1;

//  Display question or answer (0, 1)
var qora = 0;

//  Increments until reset or halt
var currentQuestion = 1;

var leftButtonCenter;
var rightButtonCenter;
var buttonDims;

var onLastQuestion;

function preload(){
  // Number of images per exam *hard-coded*
  var examOneLength = 15;
  var examTwoLength = 17;
  var examThreeLength = 15;
  var finalExamLength = 17;

  // Load carefully named and ordered JPEGs
  for (var i = 1; i<=examOneLength; i++){
    exams.one.push([loadImage("one/questions/"+i+".jpg"),loadImage("one/answers/"+i+".jpg")]);
  }
  for (var i = 1; i<=examTwoLength; i++){
    exams.two.push([loadImage("two/questions/"+i+".jpg"),loadImage("two/answers/"+i+".jpg")]);
  }
  for (var i = 1; i<=examThreeLength; i++){
    exams.three.push([loadImage("three/questions/"+i+".jpg"),loadImage("three/answers/"+i+".jpg")]);
  }
  // for (var i = 1; i<=finalExamLength; i++){
  //   exams.final.push([loadImage("final/questions/"+i+".jpg"),loadImage("final/answers/"+i+".jpg")]);
  // }

  // Load data sheets *missing final*
  for (var i = 1; i < 4; i++){
    data.push(loadImage("data/"+i+".jpg"));
  }

  // Combine all questions for final
  exams.final = exams.one.concat(exams.two,exams.three,exams.final);
}


function setup(){
  createCanvas(windowWidth,windowHeight);

  frameRate(15);
  background(255);
  rectMode(CENTER);
  imageMode(CENTER);
  textAlign(CENTER);
  examChooser = createSelect();
  examChooser.changed(selectEvent);
  examChooser.position(20, 20);
  examChooser.option('Exam 1');
  examChooser.option('Exam 2');
  examChooser.option('Exam 3');
  // examChooser.option('Final');

  // Fisher-Yates shuffle
  exams.one = shuffle(exams.one);
  exams.two = shuffle(exams.two);
  exams.three = shuffle(exams.three);
  exams.final = shuffle(exams.final);


  leftButtonCenter = createVector(width/2-(.2*width),height-(0.1*height));
  rightButtonCenter = createVector(width/2+(.2*width),height-(0.1*height));
  buttonDims = createVector(width/3,height/8);

}

function draw(){
  if(onLastQuestion){
    background(0,220,0);
    push();
    noStroke();
    fill(255);
    rect(width/2,height/2,width-25,height-25);
    pop();
  }else{
    background(255);
  }

  var examWord;
  // Draw images
  switch(activeExam){
    case 1:
      examWord = "one";
      break;
    case 2:
      examWord = "two";
      break;
    case 3:
      examWord = "three";
      break;
    case 4:
      examWord = "final";
  }
  var imgWidth = width/2;
  var imgHeight = exams[examWord][currentQuestion][qora].height * imgWidth / exams[examWord][currentQuestion][qora].width;
  image(exams[examWord][currentQuestion][qora],width/4+(.05*width),(height/2)-(0.1*height),imgWidth,imgHeight);
  var dataWidth = width/3;
  var dataHeight = data[activeExam-1].height * dataWidth / data[activeExam-1].width;
  image(data[activeExam-1],width-(dataWidth/2)-50,(height/2)-(0.1*height),dataWidth,dataHeight);
  drawButtons();
  push();
  textSize(12);
  text("CHEM 104 LAZARIDIS EXAMS",width/2,25);
}

function selectEvent(){
  var val = examChooser.value(); 
  switch(val){
    case "Exam 1": 
      exams.one = shuffle(exams.one);
      qora = 0;
      activeExam = 1;
      break;
    case "Exam 2":
      exams.two = shuffle(exams.two);
      qora = 0;
      activeExam = 2;
      break;
    case "Exam 3":
      exams.three = shuffle(exams.three);
      qora = 0;
      activeExam = 3;
      break;
    case "Final":
      exams.final = shuffle(exams.final);
      qora = 0;
      activeExam = 4;
  }
  // Reset count
  currentQuestion = 1;
  onLastQuestion = false;
}

function drawButtons(){
  push();
  strokeWeight(1);
  fill(200);
  rect(leftButtonCenter.x,leftButtonCenter.y,buttonDims.x,buttonDims.y);
  rect(rightButtonCenter.x,rightButtonCenter.y,buttonDims.x,buttonDims.y);
  pop();

  push();
  textSize(18);
  text("Answer",leftButtonCenter.x,leftButtonCenter.y+9);
  text("Next",rightButtonCenter.x,leftButtonCenter.y+9);
  pop();
}

// Fisher-Yates shuffle
function shuffle(arr) {
  var i = 0, j = 0, temp = null;
  for (var i = arr.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1));
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function touchStarted(){
  var topBound = leftButtonCenter.y - buttonDims.y/2;
  var bottomBound = leftButtonCenter.y + buttonDims.y/2;

  var leftButtonLeftBound = leftButtonCenter.x - buttonDims.x/2;
  var leftButtonRightBound = leftButtonCenter.x + buttonDims.x/2;
  var rightButtonLeftBound = rightButtonCenter.x - buttonDims.x/2;
  var rightButtonRightBound = rightButtonCenter.x + buttonDims.x/2;

  var insideLeftButton = mouseX > leftButtonLeftBound && mouseX < leftButtonRightBound && mouseY > topBound && mouseY < bottomBound;
  var insideRightButton = mouseX > rightButtonLeftBound && mouseX < rightButtonRightBound && mouseY > topBound && mouseY < bottomBound;
  if(insideLeftButton){
    if(qora === 0){
      qora = 1;
    }else{
      qora = 0
    }
  }
  if(insideRightButton){
    advance();
  }
}

function advance(){
  var currentExamLength;

  // Get the current exam length
  switch(activeExam){
    case 1:
      currentExamLength = exams.one.length;
      break;
    case 2:
      currentExamLength = exams.two.length;
      break;
    case 3:
      currentExamLength = exams.three.length;
      break;
    case 4:
      currentExamLength = exams.final.length;
  }

  // Only advance if more questions are available
  if(currentQuestion < currentExamLength-1){
    currentQuestion++;
    qora = 0;
  }else{
    onLastQuestion = true;
  }
}

function windowResized(){
    resizeCanvas(windowWidth,windowHeight);
    leftButtonCenter.set(width/2-(.2*width),height-(0.1*height));
    rightButtonCenter.set(width/2+(.2*width),height-(0.1*height));
    buttonDims.set(width/3,height/8);
}