let stems = [];
let leaves = [];
let deadLeaves = [];
let grass = [];
let flowerColors = [[245, 174, 154, 240]];
let breeze;
let blow;
let height;
let width;
let c1, c2;

function setup() {
  // put setup code here
  // up = window.innerHeight-17;
  // across = window.innderWidth-17;
  height = 400;
  width = 500;
  createCanvas(width, height);
  stems.push(new stem(width/2));
  for(let i=0; i<50; i++) {
    grass[i]=random(-5,5);
  }
  breeze = 0;
  blow = true;
} // End of setup

function draw() {
  c1 = color(255);
  c2 = color(135, 206, 250);
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    let newc = lerpColor(c1,c2,n);
    stroke(newc);
    line(0,y,width, y);
  }

  push();
  fill(87, 65, 47);
  rect(0, height-45, width, 55);
  pop();

  // Draw all stems
  stems.forEach(e => {
    e.draw();
  });

  leaves.forEach(e => {
    e.draw();
  });

  deadLeaves.forEach(e => {
    e.draw();
    e.fall();
  });

  field();
} // End of draw

function field(){
  push();
  blowBreeze();
  
  fill(6,50,11);
  let i=0;
  let p=0;
  for(let z=height-50; z<=height+30; z=z+5){
    for(let k=-50; k<width+50; k=k+2){
    stroke(6+2*grass[i],50+0.5*grass[i+5],10+2*grass[i+10]);
    strokeWeight(2);
    line(k+p+0.1, z, k+grass[i]+p+breeze, z-15+constrain(grass[i],-5,5)+breeze/10);
    i++;
    if(i==50){
      i=0;
    }
    }
   p=p+3;
  }
  pop();
}

function blowBreeze(){
  if(breeze==0){
    blow=true;
  }
  if(breeze<10 && blow==true){
  breeze=breeze+.5;
  }
   if(breeze==7){
    blow=false;
  }
  if(breeze>0 && blow==false){
  breeze=breeze-.5;
  }
}

function mouseClicked() {
  for(let i = leaves.length-1; i >= 0; i--) {
    if(leaves[i].size >= 1) {
      let xChange = 38 * ((leaves[i].rotation == -PI/6) ? 1 : -1);
      let yChange = -20;

      let mDist = dist(mouseX, mouseY, leaves[i].xPos+xChange, leaves[i].yPos+yChange);
      if(mDist <= 40) {
        // tmpX = leaves[i].xPos+xChange;
        // tmpY = leaves[i].yPos-20;
        deadLeaves.push(leaves[i]);
        leaves.splice(i, 1);
        break;
      }
    }
  }
} // End of mouseClicked

function stem(gPos) {
  this.groundPos = gPos; // Starting ground position of stem
  this.groundChange = 0; // Change in direction of stem
  this.shouldClean = true; // Clean up last elements of array after stem grows
  this.mFlower = flowerColors[Math.floor(Math.random()*flowerColors.length)];
  this.size = 0;

  // Push starting position into array storing growth points on stem
  this.growth = [];
  this.growth.push([this.groundPos, height, 1]);

  // draw:
  // Function to create/grow stem and create leaves
  this.draw = function() {
    push();
    strokeWeight(30);
    stroke(0, 100, 0);
    let lastStem = this.growth[this.growth.length-1]; // Get last stem

    // Create line of stem
    for(let i = 1; i < this.growth.length; i++) {
      line(this.growth[i-1][0], this.growth[i-1][1], this.growth[i][0], this.growth[i][1]);
    }
    pop();

    // Check if stem has grown completely
    if(lastStem[1] > 60) {
      // Check position of stem line to create random curve
      if(lastStem[0] >= this.groundPos+Math.abs(this.groundChange) || lastStem[0] <= this.groundPos-Math.abs(this.groundChange)) {
        // Clean up repetitive points to make code run more efficiently
        while(this.growth[this.growth.length-1][2] === 0) {
          this.growth.pop();
        }
        this.growth.push([lastStem[0], lastStem[1], 1]);

        this.groundChange = Math.random()*10*(Math.round(Math.random()) ? 1 : -1); // Change direction of growth
      }
      this.growth.push([lastStem[0]+(this.groundChange/50), lastStem[1]-1, 0]); // Push new line position of stem

      // Add leaves on stem
      if(lastStem[1] % 75 == 0 && lastStem[1] < height-50 && lastStem[1] > 100) {
        leaves.push(new leaf(lastStem[0], lastStem[1], (Math.round(Math.random()) ? -PI/6 : -5*PI/6)));
      }
    } else {
      // Check if should clean the last elements of array
      if(this.shouldClean) {
        this.shouldClean = false;
        while(this.growth[this.growth.length-1][2] === 0) {
          this.growth.pop();
        }
        this.growth.push([lastStem[0], lastStem[1], 1]);
      }

      push();
      translate(lastStem[0], lastStem[1]);
      fill(168, 164, 113, 240);
      noStroke();
      ellipse(0, 0, 36, 36);

      fill(this.mFlower[0], this.mFlower[1], this.mFlower[2], this.mFlower[3]);
      if(this.size < 600) {
        this.size += 4;
      }
      for (let r4 = 0; r4 < 10; r4++) {
        ellipse(0, 10 + this.size/20, 10 + this.size/40, 20 + this.size/20);
        rotate(PI / 5);
      }
      pop();
    }
  } // End of draw

  // newPlant:
  // Function to help create new position for 
  this.newPlant = function(groundPos) {
    this.growth[0][0] = groundPos;
  } // End of newPlant
}; // End of stem

// leaf:
// Function to create leaf object and control leaf movement
function leaf(xPos, yPos, rot) {
  this.size = 0; // Life size of leaf
  this.life = true; // Whether leaf is alive or not
  this.rotation = rot; // Rotation of leaf

  // Coordinates of leaf position
  this.xPos = xPos;
  this.yPos = yPos;

  // draw:
  // Controls drawing the leaf on the screen
  this.draw = function() {
    push();
    translate(this.xPos, this.yPos);
    rotate(this.rotation);

    // Leaf
    stroke(0, 0, 0);
    fill(0, 100, 0);
    ellipse(45*this.size, 0, 60*this.size, 30*this.size);
    push();
    scale(this.size);
    // Stem
    line(0, 0, 75, 0);
    // Leaf Veins
    line(15, 0, 28, 12.5);
    line(15, 0, 28, -12.5);
    line(30, 0, 45, 14.5);
    line(30, 0, 45, -14.5);
    line(45, 0, 60, 13);
    line(45, 0, 60, -13);
    line(60, 0, 70, 8);
    line(60, 0, 70, -8);
    pop();
    pop();

    if(this.size < 1) {
      this.grow();
    }
  } // End of draw

  // grow:
  // Function to control leaf growing
  this.grow = function() {
    if(this.size < 1) {
      this.size += 0.004;
    }
  } // End of grow

  // TODO - Implement Leaf Falling with wind
  // fall:
  // Function to control movement of leaf falling
  this.fall = function() {
    // this.rotation += PI/30;
    push();
    if(this.yPos < height) {
      translate(this.xPos, this.yPos += 0.5);
    }
    pop();
  } // End of fall
}; // End of leaf