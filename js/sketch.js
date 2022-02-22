let cells = 6;
let area = 600;
let pieces = [];
let grid = [];
let clickedX;
let clickedY;
let selected = null;
let x = area / cells;
let y = area / cells;

class Piece {
  constructor(length, orientation, color, origin) {
    this.length = length;
    this.orientation = orientation;
    this.color = color;
    this.origin = origin;
  }

  calculatePos() { //calculates origin coordinate of each piece based on the origin value
    let row = ceil(this.origin / cells) - 1;
    let col = ceil(this.origin % cells) - 1;
    if (col == -1) {
      col = cells - 1;
    }
    this.x = col * x;
    this.y = row * y;
  }

  show(dx = 0, dy = 0) { //draws piece at current x and y.  Can pass additional x y coordinates which will be added to current.
    fill(this.color);
    this.x += dx;
    this.y += dy;
    switch (this.orientation) {
      case "v":
        if(this.y < 0) this.y = 0;
        if(this.y + (this.length * y) > area) this.y = area - (this.length * y);
        stroke('#b2bec3');
        strokeWeight(5);
        rect(this.x, this.y, x, this.length * y, 20);
        for(let i = 1; i < this.length; i++) {
          stroke('rgba(45, 52, 54, 0.5)');
          strokeWeight(1);
          //line(this.x + 10, this.y + y*i, this.x + y - 10, this.y + y*i);
        }
        break;
      case "h":
        if(this.x < 0) this.x = 0;
        if(this.x + (this.length * x) > area) this.x = area - (this.length * x);
        stroke('#b2bec3');
        strokeWeight(5);
        rect(this.x, this.y, this.length * x, y, 20);
        for(let i = 1; i < this.length; i++) {
          stroke('rgba(45, 52, 54, 0.5)');
          strokeWeight(1);
          //line(this.x + x*i, this.y + 10, this.x + y*i, this.y + y - 10);
        }
        break;
    }
  }

  snapToGrid() { //snaps piece to the playing grid
    switch(this.orientation) {
      case "v":
        if(this.y % y !== 0) {
          this.y = round(this.y / y) * y;
        }
        break;
      case "h":
        if(this.x % x !== 0) {
          this.x = round(this.x / x) * x;
        }
        break;
    }
    this.show();
  }

  identify() { //used when mouse is clicked to identify which piece is selected, if any.
    switch(this.orientation) {
      case "v":
        if (mouseX >= this.x && 
            mouseX <= (this.x + x) && 
            mouseY >= this.y && 
            mouseY <= (this.y + (this.length * y))) {
          return true;
        }
        break;
      case "h":
        if (mouseX >= this.x && 
            mouseX <= (this.x + (this.length * x)) && 
            mouseY >= this.y && 
            mouseY <= this.y + y) {
          return true;
        }
        break;
    }
    return false;

  }
}

function generateGrid() {
  for (let i = 1; i < 6; i++) {
    line(x * i, 0, x * i, area);
    line(0, y * i, area, y * i);
  }
}

pieces.push(new Piece(2, "h", "#dd0000", 13));
pieces.push(new Piece(3, "v", "#2d3436", 19));
pieces.push(new Piece(3, "v", "#2d3436", 21));
pieces.push(new Piece(2, "v", "#2d3436", 4));
pieces.push(new Piece(2, "v", "#2d3436", 16));
pieces.push(new Piece(2, "h", "#2d3436", 11));
pieces.push(new Piece(2, "h", "#2d3436", 23));
pieces.push(new Piece(2, "h", "#2d3436", 28));
pieces.push(new Piece(2, "v", "#2d3436", 30));

function setup() {
  createCanvas(area, area);
  background('#b2bec3');
  noStroke();
  strokeWeight(4); 
  // generateGrid();
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].calculatePos();
  }
}

function draw() {
  background('#b2bec3');
  //generateGrid();
  for (let i = 0; i < pieces.length; i++) {
    pieces[i].show();
  }
}

function mousePressed() {
  clickedX = mouseX;
  clickedY = mouseY;
  for (let i = 0; i < pieces.length; i++) {
    if(pieces[i].identify()) {
      selected = i;
      break;
    }
  }
}

function mouseDragged() {
  if(selected !== null) {
    switch(pieces[selected].orientation) {
      case "v":
        pieces[selected].show(0, mouseY - clickedY);
        break;
      case "h":
        pieces[selected].show(mouseX - clickedX);
        break;
    }
  }
  clickedX = mouseX;
  clickedY = mouseY;
}

function mouseReleased() {
  if (selected !== null) pieces[selected].snapToGrid();
  selected = null;
}