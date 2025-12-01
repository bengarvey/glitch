/* globals

Circle

*/

function CircleFactory() {
  this.generate = function(total) {
    var circles = [];
    for(var i=0; i<total; i++) {
      var x = this.getRandomInt(0,window.innerWidth);
      var y = this.getRandomInt(0,window.innerHeight);
      var r = this.getRandomInt(1,4);
      var dx = this.getRandomInt(-10,10);
      var dy = this.getRandomInt(-10,10);
      var color = Math.floor(Math.random()*16777215).toString(16);
      circles.push(new Circle(x,y,r,dx,dy,color,100));
    }
    return circles;
  }

  this.getRandomInt = function(min, max) {
    return Math.ceil( (Math.random() * (max - min)) + min );
  }
}