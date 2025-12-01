/* globals

Gravity

*/

function World(height, width, gravity, boundary, canvas) {
  this.height = height;
  this.width = width;
  this.gravity = gravity;
  this.boundary = boundary;
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  this.entities = [];
  this.timerMax = 400;
  this.timer = 0;

  this.start = function() {
    setInterval((function(self) { this.tick(); }).bind(this), 20);
  }

  this.tick = function() {
    this.resize();
    //this.clear();
    this.update();
    this.draw();
  }

  this.resize = function() {
    this.height = window.innerHeight - 10;
    this.width = window.innerWidth;
    if (this.height != this.canvas.height) {
      this.canvas.height = this.height;
    }
    if (this.width != this.canvas.width) {
      this.canvas.width = this.width;
    }
  }

  this.addEntities = function(list) {
    this.entities = this.entities.concat(list);
  }

  this.getEntities = function() {
    return this.entities;
  }

  this.update = function() {
    gravity = new Gravity(this.gravity);
    this.entities = gravity.apply(this.entities);
    for(var i=0; i<this.entities.length; i++) {
      this.entities[i].move();
      this.entities[i] = this.enforceBoundaries(this.entities[i]);
    }
    
    if (this.timer < this.timerMax) {
      this.timer += 1;
    }
    else {
      this.timer = 0;
      this.gravity *= -1;
    }
    // console.log("Time: ", this.timer, "Gravity:", this.gravity);
  }

  this.enforceBoundaries = function(entity) {
    if (this.boundary == 'bounce') {
      entity.dx *= bounce(entity.x, this.width);
      entity.dy *= bounce(entity.y, this.height);
    }
    else if (this.boundary == 'wrap') {
      entity.x = wrap(entity.x, this.width);
      entity.y = wrap(entity.y, this.height);
    }
    return entity;
  }

  function bounce(value, max) {
    return (value < 0 || value > max) ? -1 : 1;
  }

  function wrap(value, max) {
    if (value > max) {
      return 0;
    }
    else if (value < 0) {
      return max;
    }
    else {
      return value;
    }
  }

  this.draw = function() {
    for(var i=0; i<this.entities.length; i++) {
      this.entities[i].draw(this.context);
    }
  }

  this.clear = function() {
    this.context.fillStyle = "#fff";
    this.context.fillRect(0, 0, this.width, this.height);
  }
}
