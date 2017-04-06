var prompts = [];
var count = 9;
var current = 0;
var asked = [];
var qora = 0;



function preload() {
  var ansButton = select('#answer');
  ansButton.changed(showAnswer);

  var nextButton = select('#next');
  nextButton.changed(advance)

  for(var i = 1; i < count+1; i++){
    prompts.push(new Array(loadImage("questions/"+i+".jpg"),loadImage("answers/"+i+".jpg")));
  }
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  
}


function draw(){
  // var current = getRandomIntInclusive(1,9);
  background(255);
  if(qora === 0){
    image(prompts[current][qora],0,0,width,prompts[current][qora].height*width/prompts[current][qora].width);
  }else{
    image(prompts[current][qora],0,0,width,prompts[current][qora].height*width/prompts[current][qora].width);
  }

}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (var i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array;
}

function showAnswer(){
  if(qora === 0){
    qora = 1;
  }else {
    qora = 0;
  }
}


function advance(){
  if(current < count-1){
    current++;
    qora = 0;
  }
}