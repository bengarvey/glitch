function Circle(x,y,r,dx,dy,color,freq) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.dx = dx; 
  this.dy = dy; 
  this.freq = freq;
  this.color = color;
  this.colorIndex = 0;

  this.jitterFreq = 0.5;
  this.jitterAmount = 3;

  this.move = function() {
    this.x += this.dx;
    this.y += this.dy;
    if (this.dy <= 0) {
      this.dy += -10;
    }   
  }

  this.draw = function(context) {
    context.beginPath();
    context.fillStyle = "#" + this.color[this.colorIndex];
    context.fillStyle = "#ff0000";
    context.arc(this.x, getY(this), this.r, 0, Math.PI*2, true);
    context.closePath();
    context.fill();
  }

  function getY(c) {
    var isJitter = c.jitterFreq > Math.random();
    console.log(isJitter, c.jitterFreq, Math.random());
    if (isJitter) {
      return c.y + c.jitterAmount;
    }   
    else {
      return c.y 
    }   
  }
}