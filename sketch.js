let stems = [];
let leaves = [];
let deadLeaves = [];
// var leaf = new leaf(15, 75, 0);

function setup() {
  // put setup code here
  createCanvas(window.innerWidth-17, window.innerHeight-17);
  stems.push(new stem(window.innerWidth/2));
} // setup

function draw() {
  // Color of background
  background(135, 206, 250);

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
} // End of draw

function mouseClicked() {
  for(let i = leaves.length-1; i >= 0; i--) {
    if(leaves[i].size >= 1) {
      let xChange = 25.98 * ((leaves[i].rotation == -PI/6) ? 1 : -1);
      let mDist = dist(mouseX, mouseY, leaves[i].xPos+xChange, leaves[i].yPos-15);
      if(mDist <= 40) {
        deadLeaves.push(leaves[i]);
        leaves.splice(i, 1);
        break;
      }
    }
  }
}

function stem(gPos) {
  this.groundPos = gPos; // Starting ground position of stem
  this.groundChange = 0; // Change in direction of stem
  this.shouldClean = true; // Clean up last elements of array after stem grows

  // Push starting position into array storing growth points on stem
  this.growth = [];
  this.growth.push([this.groundPos, window.innerHeight-17, 1]);

  // draw:
  // Function to create/grow stem and create leaves
  this.draw = function() {
    push();
    strokeWeight(30);
    stroke(0, 100, 0);
    let lastStem = this.growth[this.growth.length-1]; // Get last stem
    // Check if stem has grown completely
    if(lastStem[1] > 50) {
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
      if(lastStem[1] % 75 == 0) {
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
    }

    // Create line of stem
    for(let i = 1; i < this.growth.length; i++) {
      line(this.growth[i-1][0], this.growth[i-1][1], this.growth[i][0], this.growth[i][1]);
    }
    pop();
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
    scale(this.size);
    rotate(this.rotation);

    // Leaf
    stroke(0, 0, 0);
    fill(0, 100, 0);
    ellipse(45, 0, 60, 30);
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

  // TODO - Implement Leaf Falling
  // fall:
  // Function to control movement of leaf falling
  this.fall = function() {
    // this.rotation += PI/30;
    push();
    if(this.yPos < window.innerHeight-17) {
      translate(this.xPos, this.yPos += 0.5);
    }
    pop();
  } // End of fall
}; // End of leaf