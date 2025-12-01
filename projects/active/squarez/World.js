/* global

getRandomItem
*/

function World(config, canvas) {
  this.config = config;
  this.height = config.height;
  this.width = config.width;
  this.gravity = +config.gravity;
  this.boundary = config.boundary;
  this.refresh = +config.refresh;
  this.clearCanvas = +config.clearCanvas;
  this.canvas = canvas;
  this.context = this.canvas.getContext('2d');
  this.entities = [];
  var sizedOnce = false;

  this.ticks = -500;

  this.start = function() {
    setInterval((function(self) { this.tick(); }).bind(this), this.refresh);
  }

  this.tick = function() {
    if (!sizedOnce) {
      this.resize();
      sizedOnce = true;
    }
    if (this.clearCanvas == 1) {
      this.clear();
    }
    this.update(this.ticks);
    this.draw();
    this.ticks += 1
  }

  this.resize = function() {
    if (this.config.height == "full") {
      this.height = window.innerHeight;
    }

    if (this.config.width == "full") {
      this.width = window.innerWidth;
    }

    if (this.height != this.canvas.height) {
      this.canvas.height = this.height;
    }
    if (this.width != this.canvas.width) {
      this.canvas.width = this.width;
    }
  }

  this.setEntities = function(list) {
    this.entities = list;
  }

  this.addEntities = function(list) {
    this.entities = this.entities.concat(list);
  }

  this.getEntities = function() {
    return this.entities;
  }

  this.setConfig = function(config) {
    this.config = config;
    this.gravity = +config.gravity;
    this.boundary = config.boundary;
    this.clearCanvas = +config.clearCanvas;
    this.refresh = +config.refresh;
  }

  this.update = function(ticks) {
    this.entities.forEach( function(e, index, list) {
      e.update(ticks);
      if (list.length < 20000) {
        var ent = list[index].getNext();
        list.push(ent);
      }
      list.splice(index, 1);
    });
    // Add one more
  }

  this.enforceBoundaries = function(entity) {
    if (this.boundary == 'bounce') {
      var holdDx = entity.dx;
      var holdDy = entity.dy;
      entity.dx *= bounce(entity.x, this.width);
      entity.dy *= bounce(entity.y, this.height);
      //entity = bounceChange(holdDx, holdDy,  entity);
    }
    else if (this.boundary == 'wrap') {
      entity.x = wrap(entity.x, this.width);
      entity.y = wrap(entity.y, this.height);
    }
    return entity;
  }

  function bounce(value, max) {
    return (value < 0 || value > max) ? 0 : 1;
  }

  function bounceChange(oldDx, oldDy, entity) {
    if (oldDx != entity.dx || oldDy != entity.dy) {
      entity.colorIndex += 1;
      if (entity.colorIndex >= entity.color.length) {
        entity.colorIndex = 0;
      }
    }
    return entity;
  }

  function getRandomColor() {
    return Math.floor(Math.random()*16777215).toString(16);
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
    //this.context.fillStyle = "#fff";
    //this.context.fillRect(0, 0, this.width, this.height);
  }
}                                                                                                                                            