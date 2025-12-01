/* globals

  COLOR
  randomInt
  randomItem

*/

function Entity(x, y, dx, dy, radius, color, name, title, age, clan, type, dna, secondaryColor) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;
  this.color = color;
  this.name = name;
  this.state = 0;
  this.title = title;
  this.age = 0;
  this.clan = clan;
  this.alive = true;
  this.type = type;
  this.holding = [];
  this.decay = 0;
  this.hunger = 0;
  this.visibleRange = 1;
  this.visibleGrid = [];
  this.likesWater = false;
  this.gender = randomItem(['male', 'female']);
  this.frame = 0;
  this.frameCounter = 0;
  this.dna = dna;
  this.sprite = null;
  this.secondaryColor = secondaryColor;
  
  this.personality = {
    loyalty: randomInt(-3,10),
    lawfullness: randomInt(-3,10),
    persistence: randomInt(-3,10),
    strength: randomInt(-10,10),
    speed: randomInt(-10,10),
    stealth: randomInt(-10,10),
    charisma: randomInt(-10,10)
  }
  
  this.update = function(grid) {
    this.move(grid);
    this.animate();
    this.tryToEat();
    this.holding.forEach( (ent) => { ent.x = this.x; ent.y = this.y });
  }
  
  this.animate = function() {
    if (this.frameCounter > 10) {
      this.frame += 1;
      this.frameCounter = 0;
    }
    if (this.frame > 1) {
      this.frame = 0;
    }
    this.frameCounter += 1;
  }
  
  this.add = function(entity) {
    this.holding.push(entity); 
  }
  
  this.move = function(grid) {
    if (this.canMove(grid)) {
      this.x += this.dx;
      this.y += this.dy;
    }
  }
  
  this.canMove = function(grid) {  
    var x = this.x + this.dx;
    var y = this.y + this.dy;
    
    // Keep them inside the boundary
    if (x < 0 || y < 0 || x > grid.width || y > grid.height) {
      return false;
    }
    
    var loc = grid.getCell(x,y);
    
    if (loc.color === COLOR.WATER && !this.likesWater) {
      return false;
    }
    else {
      return true;
    }
  }
  
  this.tryToEat = function(grid) {
  }
  
  this.getName = function() {
    return this.name; 
  }
  
  this.getRadius = function() {
    return this.radius; 
  }
  
  this.getIcon = function() {
    return ''; 
  }
  
  this.remove = function() {
    return this.decay > 1000 || (!this.alive && this.state < 0);
  }
  
  this.getAgeStatus = function() {
    return 'unknown';
  }
  
  this.getPersonality = function() {
    return this.personality;
  }
  
  this.getHappiness = function() {
    return this.hunger;
  }
  
  this.getColor = function() {
    return this.color;
  }
  
  this.getSecondaryColor = function() {
    return this.secondaryColor;
  }

  return this;
}