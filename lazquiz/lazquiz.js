var prompts = [];
var count = 32;
var current = 1;
var asked = [];
var qora = 0;


function preload() {
  for(var i = 1; i < count+1; i++){
    prompts.push(new Array(loadImage('questions/'+i+'.jpg'),loadImage('answers/'+i+'.jpg')));
    prompts = shuffle(prompts);
  }
}

function setup(){
  createCanvas(windowWidth,windowHeight);
  var ansButton = select('#answer');
  ansButton.mouseClicked(showAnswer);
  var nextButton = select('#next');
  nextButton.mouseClicked(advance);
  frameRate(15);
}

function draw(){
  background(255);
  var ht = prompts[current-1][qora].height*width/prompts[current-1][qora].width;
  if(qora === 0){
    image(prompts[current-1][qora],0,0,width,ht);
  }else{
    image(prompts[current-1][qora],0,0,width,ht);
  }
}

// https://www.frankmitchell.org/2015/01/fisher-yates/>
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

function showAnswer(){
  if(qora === 0){
    qora = 1;
  }else {
    qora = 0;
  }
}

function advance(){
  if(current >= count){
    prompts = shuffle(prompts);
    qora=0;
    current = 1;
  }else if(current < count){
    current++;
    qora = 0;
  }
}

function windowResized(){
  resizeCanvas(windowWidth,windowHeight);
}