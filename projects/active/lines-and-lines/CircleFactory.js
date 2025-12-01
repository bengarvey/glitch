/* globals

Circle

*/

function CircleFactory() {
  this.generate = function(total) {
    var circles = [];
    for(var i=0; i<total; i++) {
      let x = this.getRandomInt(0,window.innerWidth);
      let y = this.getRandomInt(0,window.innerHeight);
      let r = this.getRandomInt(1,7);
      let dxdy = this.getRandomDxDy();
      let red = Math.floor(Math.random()*50) + 205;
      let green = Math.floor(Math.random()*255);
      let blue = Math.floor(Math.random()*255);
      let color = this.getColor();
      console.log(color);
      circles.push(new Circle(x,y,r,dxdy[0],dxdy[1],color,100));
    }
    return circles;
  }

  this.getRandomInt = function(min, max) {
    return Math.ceil( (Math.random() * (max - min)) + min );
  }
  
  this.getRandomDxDy = function() {
    let r = Math.random();
    let max = 3;
    let min = max * -1;
    if (r < 0.33) {
      return [this.getRandomInt(min, max), 0];
    }
    else if (r < 0.66) {
      return [0, this.getRandomInt(min, max)];
    }
    else {
      return [this.getRandomInt(min, max), this.getRandomInt(min, max)];      
    }
  }
  
  this.getColor = function() {
    let r = Math.random();
    let a = 1;
    if (r < 0.16) {
      return `rgba(${this.getHighNumber()}, ${this.getLowNumber()}, ${this.getLowNumber()}, ${a})`; 
    }
    else if (r < 0.32) {
      return `rgba(${this.getLowNumber()}, ${this.getHighNumber()}, ${this.getLowNumber()}, ${a})`;      
    }
    else if (r < 0.48) {
      return `rgba(${this.getLowNumber()}, ${this.getLowNumber()}, ${this.getHighNumber()}, ${a})`;  
    }
    else if (r < 0.64) {
      return `rgba(${this.getHighNumber()}, ${this.getHighNumber()}, ${this.getLowNumber()}, ${a})`;  
    }
    else if (r < 0.80) {
      return `rgba(${this.getHighNumber()}, ${this.getLowNumber()}, ${this.getHighNumber()}, ${a})`;  
    }
    else if (r < 0.96) {
      return `rgba(${this.getLowNumber()}, ${this.getHighNumber()}, ${this.getHighNumber()}, ${a})`;  
    }
    else {
      return `rgba(${this.getHighNumber()}, ${this.getHighNumber()}, ${this.getHighNumber()}, ${a})`;  
    }
  }
  
  this.getHighNumber = function() {
    return Math.floor(Math.random()*1) + 254;
  }
  
  this.getLowNumber = function() {
    return Math.floor(Math.random()*230) + 25;
  }
}