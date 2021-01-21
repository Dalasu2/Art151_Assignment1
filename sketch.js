let stems = [];
let leaves = [];
let deadLeaves = [];
let grass = [];
let flowerColors = [[245, 174, 154, 240], [245, 174, 184, 240],
                    [245, 204, 174, 240], [235, 194, 204, 240], [230, 190, 230, 240]];
let breeze;
let blow;
let height;
let width;

let gPositions = [];
let c1, c2;
let mAlpha = 255;
let time;

let bg, gbg;

function setup() {
  // put setup code here
  // up = window.innerHeight-17;
  // across = window.innderWidth-17;
  // height = 400;
  // width = 500;
  height = window.innerHeight-17;
  width = window.innerWidth-17;

  gPositions.push(width*2/8, width*3/8, width*5/8, width*6/8, width*7/8, width/8);

  createCanvas(width, height);
  stems.push(new stem(width/2));

  bg = createGraphics(width, height-50);
  gbg = createGraphics(width, height);

  time = millis();

  sky();
  field();
} // End of setup

function draw() {
  // Draw background
  image(bg, 0, 0);
  image(gbg, 0, 0);

  // Draw all stems
  stems.forEach(e => {
    e.draw();
  });

  // Backdrop color for grass to blend
  push();
  fill(6,50,11);
  noStroke();
  rect(0, height-20, width, 20);
  pop();

  // Draw all leaves
  leaves.forEach(e => {
    e.draw();
  });

  // Animate leaves
  deadLeaves.forEach(e => {
    e.draw();
    e.fall();
  });

  if(gPositions.length > 0 && millis()-time > 5000) {
    let tmp = Math.floor(Math.random()*gPositions.length);
    stems.push(new stem(gPositions[tmp]));
    // console.log("number: " + gPositions[tmp] + ", width: " + width);
    gPositions.splice(tmp, 1);
    time = millis();
  }
} // End of draw

// sky:
// Draw the sky and add it to the bg image
function sky() {
  // push();
  c1 = color(255);
  c2 = color(135, 206, 250);
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    n *=2;
    let newc = lerpColor(c1,c2,n);
    bg.stroke(newc);
    bg.line(0,y,width, y);
  }
  // pop();
} // End of sky

// field:
// Draw the grass and add it to the gbg image
function field(){
  for(let i=0; i<50; i++) {
    grass[i]=random(-5,5);
  }
  breeze = 0;
  blow = true;

  push();

  gbg.fill(87, 65, 47);
  gbg.rect(0, height-45, width, 55);
  
  fill(6,50,11);
  let i=0;
  let p=0;
  for(let z=height-50; z<=height+30; z=z+5){
    for(let k=-50; k<width+25; k=k+2){
      gbg.stroke(6+2*grass[i],50+0.5*grass[i+5],10+2*grass[i+10]);
      gbg.strokeWeight(2);
      gbg.line(k+p+0.1, z, k+grass[i]+p+breeze, z-15+constrain(grass[i],-5,5)+breeze/10);
      i++;
      if(i==50){
        i=0;
      }
    }
   p=p+3;
  }
  pop();
} // End of field

function mouseClicked() {
  for(let i = leaves.length-1; i >= 0; i--) {
    if(leaves[i].size >= 1) {
      let mDist = dist(mouseX, mouseY, leaves[i].xLeaf, leaves[i].yLeaf);
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
  this.groundPos = gPos+(Math.round(Math.random()*30)*(Math.round(Math.random()) ? 1 : -1)); // Starting ground position of stem
  this.groundChange = 0; // Change in direction of stem
  this.shouldClean = true; // Clean up last elements of array after stem grows
  this.mFlower = flowerColors[Math.floor(Math.random()*flowerColors.length)];
  this.size = 0;
  this.mHeight = Math.round(Math.random()*200+60);

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
    if(lastStem[1] > this.mHeight) {
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
      if(lastStem[1] % 75 == 0 && lastStem[1] < height-50 && lastStem[1] > this.mHeight+100) {
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
      ellipse(0, 0, 50, 50);

      fill(this.mFlower[0], this.mFlower[1], this.mFlower[2], this.mFlower[3]);
      if(this.size < 1000) {
        this.size += 4;
      }
      for (let r4 = 0; r4 < 10; r4++) {
        ellipse(0, 10 + this.size/20, 10 + this.size/30, 20 + this.size/15);
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
  this.rotDir = (rot > -1) ? 1 : -1;
  this.rotMag = 0;
  this.rotBool = false;

  // Coordinates of leaf stem position
  this.xPos = xPos;
  this.yPos = yPos;
  this.newXPos = xPos;

  // Coordinates of leaf
  this.xLeaf = this.xPos+(38 * ((this.rotation == -PI/6) ? 1 : -1));
  this.yLeaf = this.yPos-20;

  // draw:
  // Controls drawing the leaf on the screen
  this.draw = function() {
    push();
    translate(this.xPos, this.yPos);
    rotate(this.rotation);
    scale(this.size);

    // Leaf
    stroke(0, 0, 0);
    strokeWeight(1.1);
    fill(0, 100, 0);
    // ellipse(45*this.size, 0, 59*this.size, 29*this.size);
    ellipse(45, 0, 60, 30);
    // push();
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
    // pop();
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
    push();
    if(this.yPos < height && this.yLeaf < height) {
      this.rotation += this.rotDir*this.rotMag*PI/60;
      if(this.rotBool) {
        this.rotMag -= 0.05;
        if(this.rotMag <= -1) { this.rotBool = false; }
      } else {
        this.rotMag += 0.05;
        if(this.rotMag >= 1) { this.rotBool = true; }
      }

      if(this.xPos == this.newXPos) {
        this.newXPos += Math.round((Math.random()+1)*10*(Math.round(Math.random()) ? -1 : 1));
      } else if(this.newXPos > this.xPos) {
        this.xPos += 0.5;
      } else {
        this.xPos -= 0.5;
      }
      translate(this.xPos, this.yPos += 1);
    }
    pop();
  } // End of fall
}; // End of leaf