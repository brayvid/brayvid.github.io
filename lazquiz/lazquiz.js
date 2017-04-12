// *Final exam not ready*
// *Equations/add'l info not ready*

// Structure: JPEG } p5.image }} Array }} Object-exams
var exams = {
  one: [],
  two: [],
  three: [],
  final: []
};

//  Selected through drop-down (1, 2, 3 or 4)
var activeExam = 1;

//  Display question or answer (0, 1)
var qora = 0;

//  Increments until reset or halt
var currentQuestion = 1;

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


  // Combine all questions for final
  exams.final = exams.one.concat(exams.two,exams.three,exams.final);
}


function setup(){
  if(windowWidth < 1000){
    createCanvas(windowWidth,windowHeight);
  }else{
    createCanvas(windowWidth/2,windowHeight);
  }

  frameRate(15);
  background(255);

  examChooser = createSelect();
  examChooser.changed(selectEvent);

  examChooser.position(20, 20);
  examChooser.option('Exam 1');
  examChooser.option('Exam 2');
  examChooser.option('Exam 3');
  examChooser.option('Final');

  exams.one = shuffle(exams.one);
  exams.two = shuffle(exams.two);
  exams.three = shuffle(exams.three);
  exams.final = shuffle(exams.final);
}

function draw(){
  background(255);
  switch(activeExam){
    case 1:
      ht = exams.one[currentQuestion][qora].height*width/exams.one[currentQuestion][qora].width;
      image(exams.one[currentQuestion][qora],0,35,width,ht);
      break;
    case 2:
      ht = exams.two[currentQuestion][qora].height*width/exams.two[currentQuestion][qora].width;
      image(exams.two[currentQuestion][qora],0,35,width,ht);
      break;
    case 3:
      ht = exams.three[currentQuestion][qora].height*width/exams.three[currentQuestion][qora].width;
      image(exams.three[currentQuestion][qora],0,35,width,ht);
      break;
    case 4:
      ht = exams.final[currentQuestion][qora].height*width/exams.final[currentQuestion][qora].width;
      image(exams.final[currentQuestion][qora],0,35,width,ht);
      break;
  }
  drawButtons();
}



function selectEvent(){
  var val = examChooser.value(); 
  if(val === "Exam 1"){
    exams.one = shuffle(exams.one);
    qora = 0;
    activeExam = 1;
  }else if(val === "Exam 2"){
    exams.two = shuffle(exams.two);
    qora = 0;
    activeExam = 2;
  }else if(val === "Exam 3"){
    exams.three = shuffle(exams.three);
    qora = 0;
    activeExam = 3;
  }else if(val === "Final"){
    exams.final = shuffle(exams.final);
    qora = 0;
    activeExam = 4;
  }
  currentQuestion = 1;
}


function drawButtons(){
  buttonHeight = height/10;
  buttonWidth = width/2.5;
  push();
  strokeWeight(1);
  fill(200);
  rect(0,height-buttonHeight-15,buttonWidth,buttonHeight-1);
  rect(width-buttonWidth-1,height-buttonHeight-15,buttonWidth,buttonHeight-1);
  pop();
  push();
  textAlign(CENTER);
  textSize(15);
  text("Answer",buttonWidth/2,height-(buttonHeight/1.6));
  text("Next",2*buttonWidth,height-(buttonHeight/1.6));
  pop();
}


// Fisher-Yates Shuffle
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
  if(mouseX < width/2 && mouseY > height-height/8){
    toggleAnswer();
  }

  if(mouseX > width/2 && mouseY > height-height/8){
    advance();
  }
}

function toggleAnswer(){
  if(qora === 0){
    qora = 1;
  }else{
    qora = 0
  }
}


function advance(){
  var currentExamLength;
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
  if(currentQuestion < currentExamLength-1){
    currentQuestion++;
    qora = 0;
  }
}

function windowResized(){
  if(windowWidth < 1000){
    resizeCanvas(windowWidth,windowHeight);
  }else{
    resizeCanvas(windowWidth/2,windowHeight);
  }
}