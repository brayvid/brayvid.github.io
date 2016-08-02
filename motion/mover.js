
// Uses:
// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

var Mover = function() {
  
  this.position = createVector(random(24, windowWidth-24), random(24, windowHeight-24));
  this.velocity = createVector(random(-10,10), random(-10, 10));

  this.update = function() {
    this.position.add(this.velocity);
  };

  this.display = function() {
    stroke(0);
    strokeWeight(2);
    fill(0,255,0);
    ellipse(this.position.x, this.position.y, 48, 48);
  };

  this.checkEdges = function() {

    if (this.position.x > windowWidth - 24) {
      this.velocity.x = -1*this.velocity.x;
    } 
    else if (this.position.x < 24) {
      this.velocity.x = -1*this.velocity.x;
    }

    if (this.position.y > windowHeight - 24) {
      this.velocity.y = -1*this.velocity.y;
    } 
    else if (this.position.y < 24) {
      this.velocity.y = -1*this.velocity.y;
    }
  };
};

