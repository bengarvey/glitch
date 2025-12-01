function start(name) {
  var drawing_canvas = document.getElementById(name);
  var context = drawing_canvas.getContext('2d');
  var WORLD_HEIGHT = window.innerHeight >= 600 ? 600 : window.innerHeight;
  var WORLD_WIDTH = window.innerWidth;
  var dots = generateDots(Math.random() * 50, context, getRandomRGBA());
  console.log(dots);

  
  setInterval(() => {
    updateDots();
  }, 10);
  
   console.log("started");
  
  function updateDots() {
    dots.forEach( (d) => { d.check(); });
    dots.forEach( (d) => { d.move(); });
    //context.clearRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    dots.forEach( (d) => { d.draw(); });
    updateCanvas('sky');
    WORLD_HEIGHT = window.innerHeight;
    WORLD_WIDTH = window.innerWidth;
  }
  
  function generateDots(total, context, color) {
    var dots = [];
    for(var i=0; i<total; i++) {
      dots.push(generateDot(context, color)); 
    }
    return dots;
  }
  
  function generateDot(context, color) {
    var dx, dy = 0;
    if (Math.random() > 0.5) {
      dx = Math.random() * 6 - 3; 
      dy = 0;
    }
    else {
      dy = Math.random() * 6 - 3; 
      dx = 0;
    }
    var random = 0.9;
    return {
      x: WORLD_WIDTH/2,
      y: WORLD_HEIGHT/3,
      dx: dx,
      dy: dy,
      radius: Math.random() * 3 + 1,
      random: random,
      color: color,
      move: function() {
        this.x += this.dx;
        this.y += this.dy;
        
        if (Math.random() > this.random) {
          if (Math.random() > 0.5) {
            this.dx = Math.random() * 6 - 3; 
            this.dy = 0;
          }
          else {
            this.dy = Math.random() * 6 - 3; 
            this.dx = 0;
          }
        }
      },
      check: function() {
        //this.x = this.x < WORLD_WIDTH / 2 ? 0.5 : -0.5;
        //this.y = this.y < WORLD_HEIGHT / 2 ? 0.5 : -0.5;
      },
      context: context,
      
      draw: function() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
        this.context.fillStyle = this.color;
        this.context.fill();
      }
      
    }
  }
  
  function updateCanvas(name) {
    WORLD_WIDTH = window.innerWidth;
    WORLD_HEIGHT = window.innerHeight >= 600 ? 600 : window.innerHeight;
    var canvas = document.getElementById(name);
    if (canvas.height != WORLD_HEIGHT) {
      canvas.height = WORLD_HEIGHT;
      canvas.width = WORLD_WIDTH;
    }
  }
  
  function color() {
    return Math.floor(Math.random()*256); 
  }
  
  function getRandomRGBA() {
    return `rgba(${color()},${color()},${color()},${Math.random()*0.9})`;
  }
}

function test() {
  console.log("test"); 
}

function findOutMore() {
  var i = 0;
  var cancel = setInterval( () => {
      window.scroll(0,i);
      i += 20;
      if (i > 600) {
        clearInterval(cancel);
      }
    }, 10);
}