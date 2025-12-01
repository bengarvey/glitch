var Territory = function(id, x, y, radius, name, color) {
  this.id = id;
  this.x = x;
  this.y = y;
  this.radius = radius;
  this.name = name;
  this.color = color;
  this.opacity = 0.3;
  
  return this;
}