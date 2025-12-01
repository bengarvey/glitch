/* globals
  Circle
*/

function CircleFactory(config) {
  this.config = config;
  this.generate = function() {
    var circles = []; 
    var pallete = getPallete(this.config.palleteTotal);
    for(var i=0; i<this.config.qty; i++) {
      var x = this.getRandomInt(+this.config.x[0], +this.config.x[1]);
      var y = this.getRandomInt(+this.config.y[0], +this.config.y[1]);
      var r = this.getRandomInt(+this.config.radius[0], +this.config.radius[1]);
      var dx = this.getRandomInt(+this.config.dx[0], +this.config.dx[1]);
      var dy = this.getRandomInt(+this.config.dy[0], +this.config.dy[1]);
      var color = getColorScheme(this.config.color, pallete);
      circles.push(new Circle(x,y,r,dx,dy,color,100));
    }   
    return circles;
  }

  this.setConfig = function(config) {
    this.config = config;
  }

  this.getRandomInt = function(min, max) {
    return Math.ceil( (Math.random() * (max - min)) + min );
  }

  function getPallete(total) {
    var colors = []; 
    for(var i=0; i<total; i++) {
      colors.push(getRandomColor());
    }   
    return colors;
  }

  function getColorScheme(type, pallete) {
    if (type == 'random') {
      return [getRandomColor()];
    }   
    else if (type == 'pallete') {
      return pallete;
    }   
    else {
      return [type];
    }   
  }

  function getRandomColor() {
    return Math.floor(Math.random()*16777215).toString(16);
  }
}