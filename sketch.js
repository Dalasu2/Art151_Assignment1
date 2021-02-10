let stems = [];
let leaves = [];
let deadLeaves = [];
let grass = [];
let rain = [];
let flowerColors = [{r: 255, g: 174, b:154, a:240}, {r:245, g:174, b:184, a:240},
                  {r:245, g:204, b:174, a:240}, {r:235, g:194, b:204, a:240}, {r:230, g:190, b:230, a:240}];
let breeze;
let blow;
let height;
let width;

let gPositions = [];
let c1, c2, bc;
let mAlpha = 210;
let time, rainTime;
let newStems = true, shouldRain = true;

let bg, gbg, lbg;
let rgb1, rgb2;

function setup() {
  rgb1 = {r: 118, g: 110, b: 118};
  rgb2 = {r: 25, g: 96, b: 140};
  height = window.innerHeight-17;
  width = window.innerWidth-17;

  createCanvas(width, height);

  bg = createGraphics(width, height-50);
  gbg = createGraphics(width, height);
  lbg = createGraphics(width, height);

  time = millis();
  rainTime = millis();

  sky();
  field();

  alert("Art 151 Assignment 1 | Lifecycle\n"
        +"_________________________________________________________________________\n"
        +"Controls:\n"
        +"- Use the Left Mouse Button to click on leaves and click on the sky\n"
        +"- Press \'r\' to refresh web page\n"
        +"_________________________________________________________________________\n"
        +"The major colors were selected with the idea of creating a realistic piece. The flower colors are pastel colors, which are "
        +"appealing to the eye. The background is a gradient color that darkens and lightens depending on what is going on in the scene. "
        +"The flowers are randomly generated, with the stems growing in random directions restricted to a column of space. The leaves "
        +"and the rain falling are also random in movement, as well as the coloring of dead leaves and the coloring of the flower petals.\n"
        +"This project does not focus on what the user can physically make, but rather what the machine can randomly create for the user.\n"
        +"_________________________________________________________________________\n");
} // End of setup

// TODO - Add rain
// TODO - Add death to flowers
function draw() {
  // Draw background
  image(bg, 0, 0);
  image(gbg, 0, 0);

  // Draw all stems
  for(let i = stems.length-1; i >= 0; i--) {
    let stem = stems[i];
    if(stem.stemWeight <= 0) {
      stems.splice(i, 1);
    } else {
      stem.draw();
    }
  }

  // Backdrop color for grass to blend
  push();
  fill(6,50,11);
  noStroke();
  rect(0, height-20, width, 20);
  pop();

  if(newStems && rain.length == 0 && millis()-time > 5000 && gPositions.length > 0) {
    let tmp = Math.floor(Math.random()*gPositions.length);
    stems.push(new stem(gPositions[tmp]));
    gPositions.splice(tmp, 1);
    time = millis();
    shouldRain = true;
  } else if(newStems && gPositions.length == 0) {
    newStems = false;
  }

  // Draw leaves on ground
  image(lbg, 0, 0);

  // Animate leaves
  for(let i = deadLeaves.length-1; i >= 0; i--) {
    let leaf = deadLeaves[i];
    leaf.draw();
    if(!leaf.life) {
      deadLeaves.splice(i, 1);
      image(lbg, 0, 0);
    }
    leaf.fall();
  }

  for(let i = rain.length-1; i >= 0; i--) {
    rain[i].dropRain();
    if(rain[i].splash()) {
      rain.splice(i, 1);
    }
  }

  if(rain.length > 0) {
    var shouldChange = false;
    if(rgb1.r < 255) {
      shouldChange = true;
      rgb1.r += 0.25 * (150/rain.length);
    }
    if(rgb1.g < 255) {
      shouldChange = true;
      rgb1.g += 0.25 * (150/rain.length);
    }
    if(rgb1.b < 255) {
      shouldChange = true;
      rgb1.b += 0.25 * (150/rain.length);
    }

    if(rgb2.r < 135) {
      shouldChange = true;
      rgb2.r += 0.25 * (150/rain.length);
    }
    if(rgb2.g < 206) {
      shouldChange = true;
      rgb2.g += 0.25 * (150/rain.length);
    }
    if(rgb2.b < 250) {
      shouldChange = true;
      rgb2.b += 0.25 * (150/rain.length);
    }
    
    if(shouldChange) {
      sky();
    }
  }
} // End of draw

function keyTyped() {
  if(key === 'r') {
    console.log("reset");
    location.reload();
  }
} // End of keyTyped

function mouseClicked() {
  if(stems.length == 0 && shouldRain) {
    gPositions.push(width/2, width*2/8, width*3/8, width*5/8, width*6/8, width*7/8, width/8);
    shouldRain = false;
    newStems = true;
    rainTime = millis();
    initRain(); // Create rain droplets
  }

  outerLoop:
  for(let h = stems.length-1; h >= 0; h--) {
    let s = stems[h];
    for(let i = s.leaves.length-1; i >= 0; i--) {
      let leaf = s.leaves[i];
      if(leaf.size >= 1) {
        let mDist = dist(mouseX, mouseY, leaf.xLeaf, leaf.yLeaf);
        if(mDist <= 40) {
          deadLeaves.push(leaf);
          s.leaves.splice(i, 1);
          rgb1.r -= 2.5;
          rgb1.g -= 2.64;
          rgb1.b -= 2.5;
          rgb2.r -= 2;
          rgb2.g -= 2;
          rgb2.b -= 2;
          sky();
          break outerLoop;
        }
      }
    }
  }
} // End of mouseClicked

// initRain:
// Initialize rain array with new rain drops
function initRain() {
  for (i = 0; i < 200; i++) {
    rain.push(new Rain(random(50, width-50), random(0, -3000)));
  }
} // End of initRain

// sky:
// Draw the sky and add it to the bg image
function sky() {
  c1 = color(rgb1.r, rgb1.g, rgb1.b);
  // c1 = color(99, 99, 99);
  c2 = color(rgb2.r, rgb2.g, rgb2.b);
  // c2 = color(0);
  for(let y=0; y<height; y++){
    n = map(y,0,height,0,1);
    n *=2;
    let newc = lerpColor(c1,c2,n);
    bg.stroke(newc);
    bg.line(0,y,width, y);
  }
} // End of sky

function Rain(x, y) {
  this.x = x;
  this.y = y;
  this.length = 15;
  this.r = 0;
  this.opacity = 200;
  this.life = true;


  this.dropRain = function() {
    push();
    noStroke();
    fill(138, 150, 168);
    ellipse(this.x, this.y, 3, this.length);
    this.y = this.y + 6 //+ frameCount/60;
    if (this.y > height-20) {
      this.length = this.length - 5;
    }

    if (this.length < 0) {
      this.length = 0;
    }
    pop();
  } // End of dropRain

  this.splash = function() {
    push();
    strokeWeight(2);
    stroke(0, 61, 98, this.opacity);
    noFill();
    if (this.y > height-20) {
      ellipse(this.x, height-20, this.r * 2, this.r / 2);
      this.r++;
      this.opacity = this.opacity - 10;

      //keep the rain dropping
      if (this.opacity < 0) {
        if(millis()-rainTime < 8000) {
          this.y = random(0, -100);
          this.length = 15;
          this.r = 0;
          this.opacity = 200;
        } else {
          return true;
        }
      }
    }
    return false
    pop();
  } // End of splash
}

// field:
// Draw the grass and add it to the gbg image
function field(){
  for(let i=0; i<50; i++) {
    grass[i]=random(-5,5);
  }
  breeze = 0;
  blow = true;

  gbg.push();

  gbg.fill(87, 65, 47);
  gbg.rect(0, height-45, width, 55);
  
  gbg.fill(6,50,11);
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
  gbg.pop();
} // End of field

function stem(gPos) {
  this.leaves = []; // Array to stores leaves
  this.groundPos = gPos+(Math.round(Math.random()*30)*(Math.round(Math.random()) ? 1 : -1)); // Starting ground position of stem
  this.groundChange = 0; // Change in direction of stem
  this.shouldClean = true; // Clean up last elements of array after stem grows
  this.mFlower = JSON.parse(JSON.stringify(flowerColors))[Math.floor(Math.random()*flowerColors.length)];
  this.size = 0;
  this.mHeight = Math.round(Math.random()*200+60);
  this.color = {r: 0, g:100, b:0, a: 255};
  this.stemWeight = 30;

  // Push starting position into array storing growth points on stem
  this.growth = [];
  this.growth.push([this.groundPos, height, 1]);

  // draw:
  // Function to create/grow stem and create leaves
  this.draw = function() {
    this.leaves.forEach(e => {
      e.draw();
    });

    push();
    strokeWeight(this.stemWeight);
    let mColor = color(this.color.r, this.color.g, this.color.b, this.color.a);
    stroke(mColor);
    let lastStem = this.growth[this.growth.length-1]; // Get last stem

    // Create line of stem
    for(let i = 1; i < this.growth.length; i++) {
      fill(mColor);
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
        this.leaves.push(new leaf(lastStem[0], lastStem[1], (Math.round(Math.random()) ? -PI/6 : -5*PI/6)));
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
      fill(168, 164, 113, this.mFlower.a);
      noStroke();
      ellipse(0, 0, 50, 50);

      fill(this.mFlower.r, this.mFlower.g, this.mFlower.b, this.mFlower.a);
      if(this.size < 1000) {
        this.size += 4;
      }
      for (let r4 = 0; r4 < 10; r4++) {
        ellipse(0, 10 + this.size/20, 10 + this.size/30, 20 + this.size/15);
        rotate(PI / 5);
      }
      pop();

      if(this.leaves.length == 0) {
        if(this.color.g > 50) {
          // Adjust stem color
          this.color.g -= 1;
          this.color.r += 0.5;
          this.color.b  += 0.5;

          // Adjust flower color
          this.mFlower.r -= 1;
          this.mFlower.g -= 1;
          this.mFlower.b -= 1;
        } else {
          this.color.a -= 20;
          this.mFlower.a -= 20;
          this.stemWeight -= 30*20/255;
        }
      }
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
  this.color = {r: 0, g: 100, b: 0};

  // draw:
  // Controls drawing the leaf on the screen
  this.draw = function() {
    if(this.life) {
      push();
      translate(this.xPos, this.yPos);
      rotate(this.rotation);
      scale(this.size);

      // Leaf
      stroke(0, 0, 0);
      strokeWeight(1.1);
      fill(this.color.r, this.color.g, this.color.b);
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
    } else {
      lbg.push();
      lbg.translate(this.xPos, this.yPos);
      lbg.rotate(this.rotation);
      lbg.scale(this.size);

      // Leaf
      lbg.stroke(0, 0, 0);
      lbg.strokeWeight(1.1);
      lbg.fill(this.color.r, this.color.g, this.color.b);
      lbg.ellipse(45, 0, 60, 30);

      // Stem
      lbg.line(0, 0, 75, 0);

      // Leaf Veins
      lbg.line(15, 0, 28, 12.5);
      lbg.line(15, 0, 28, -12.5);
      lbg.line(30, 0, 45, 14.5);
      lbg.line(30, 0, 45, -14.5);
      lbg.line(45, 0, 60, 13);
      lbg.line(45, 0, 60, -13);
      lbg.line(60, 0, 70, 8);
      lbg.line(60, 0, 70, -8);
      lbg.pop();
    }

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

  // fall:
  // Function to control movement of leaf falling
  this.fall = function() {
    push();
    if(this.yPos < height-20 && this.yLeaf < height) {
      this.rotation += this.rotDir*this.rotMag*PI/60;
      if(this.rotBool) {
        this.rotMag -= 0.05;
        if(this.rotMag <= -1) { this.rotBool = false; }
      } else {
        this.rotMag += 0.05;
        if(this.rotMag >= 1) { this.rotBool = true; }
      }

      if(this.xPos == this.newXPos) {
        this.newXPos += Math.round((Math.random()+1)*20*(Math.round(Math.random()) ? -1 : 1));
      } else if(this.newXPos > this.xPos) {
        this.xPos += 0.5;
      } else {
        this.xPos -= 0.5;
      }
      translate(this.xPos, this.yPos += 1);
    } else {
      if(this.color.b < 70) {
        let change = Math.random() * 0.8 * this.rotDir;
        this.color.r += 3 + change;
        this.color.g += change;
        this.color.b += 2;
      } else {
        this.life = false;
      }
    }
    pop();
  } // End of fall
}; // End of leaf