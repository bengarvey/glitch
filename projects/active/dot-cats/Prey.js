/* globals

Entity
getOffset
getRandomInt
COLOR

*/

function Prey(x, y, dx, dy, radius, color, name, title, age, clan, type, dna, secondaryColor) {
  Entity.call(this, x, y, dx, dy, radius, color, name, title, age, clan, null, null, secondaryColor);
  this.type = 'prey';
  this.name = name;
  this.color = color;
  this.state = 5000;
  
  this.update = function(grid) {

    if (this.alive) {
      this._moveCheck(0.9);
      
      if (this.canMove(grid)) {
         this.move();     
      }
      
      this.tryToEat(grid);

    }
    else {
      this.decay += 1; 
    }
  }
  
  this._moveCheck = function(chance) {
    if (Math.random() > chance) {
      this.dx = getOffset(3);
      this.dy = getOffset(3);
    }
  }
  
  this.getMaxState = function() {
    return 100000; 
  }
  
  this.move = function() {
    if (Math.random() > 0.5) {
      this.x += this.dx;
      this.y += this.dy;
      this.hunger -= 1;
    }  
  }
  
  this.tryToEat = function(grid) {
    if (this.hunger > 0) {
      return;
    }
    
    var x = this.x;
    var y = this.y;
    var loc = grid.getCell(x,y);
    
    if (loc.color === COLOR.PLANT && loc.value > 0) {
      loc.value -= 10;
      this.hunger += 10;
    }
    else if (loc.color === COLOR.PLANT && loc.value <= 0) {
      loc.color = COLOR.BLANK;
      loc.value -= 10;
    }
  }
  
  this.eat = function(grid) {
    this.hunger += 100;
  }
  
  this.getColor = function() {
    return this.color;
  }

  this.getSecondaryColor = function() {
    return this.secondaryColor;
  }
  
  return this;
}