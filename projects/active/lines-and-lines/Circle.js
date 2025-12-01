function Circle(x,y,r,dx,dy,color,freq) {
  this.x = x;
  this.y = y;
  this.r = r;
  this.dx = dx;
  this.dy = dy;
  this.freq = freq;
  this.color = color;

  this.move = function() {
    this.x += this.dx;
    this.y += this.dy;
  }

  this.draw = function(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.r, 0, Math.PI*2, true);
    context.closePath();
    context.globalAlpha = 0.3;
    context.fill();
  }
}
