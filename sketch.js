// var grass
var rotation = 0;

function setup() {
  // put setup code here
  createCanvas(900, 700);
} // setup

function draw() {
  // put drawing code here
  background(135, 206, 250);
  translate(width/2, height/2);
  // rotate(rotation);
  new leaf();
  rotation += PI/150;
} // End of draw

function leaf() {
  noFill();
  stroke(0);
  curve(5, 26, 20, 30, 73, 20, 73, 80);
};