var World = function(canvasId) {

  var WORLD_HEIGHT = window.innerHeight;
  var WORLD_WIDTH = window.innerWidth;
  var WORLD_DEPTH = WORLD_WIDTH;
  var gravityX = WORLD_WIDTH / 2;
  var gravityY = WORLD_HEIGHT / 2;
  var gravityZ = WORLD_DEPTH / 2;
  var gravity = 0.05;
  
  var dx = 5;
  var dy = 5;
  var dz = 5;
  var dwidth = 500;
  var dheight = 500;
  var ddepth = 500;

  // Get the canvas element we need
  var drawing_canvas = document.getElementById(canvasId);
  
  function handleClick(event) {
    gravityX = event.clientX;
    gravityY = event.clientY;
  }

  // Initaliase a 2-dimensional drawing context
  var context = drawing_canvas.getContext('2d');

  function drawCircle(x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, Math.PI*2, true);
    context.closePath();
    context.lineWidth = 0;
    context.fill();
  }

  function drawLine(startX, startY, endX, endY, color) {
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX,endY);
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();
  }

  function Planet(x, y, z, dx, dy, dz, radius, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
    this.radius = radius;
    this.color = color;
  }

  function draw(planet, index, planets) {

    var zScale = ( (WORLD_DEPTH - planet.z) / WORLD_DEPTH );
    zScale = zScale < 0 ? 0 : zScale;
    var radius = planet.radius * zScale < 1 ? 1 : planet.radius * zScale;
    drawCircle(planet.x, planet.y, radius, planet.color);
    if (index > 0) {
      var previous = planets[index-1];
      //drawLine(previous.x, previous.y, planet.x, planet.y, planet.color);
    }
  }

  function move(planet) {
    planet.x += planet.dx;
    planet.y += planet.dy;
    planet.z += planet.dz;

    // gravity check
    planet = _gravityCheck(planet, gravity, gravityX, gravityY, gravityZ);

  }

  function _gravityCheck(planet, gravity, gravityX, gravityY, gravityZ) {
    if (planet.x > gravityX) {
      planet.dx -= gravity;
    }
    else {
      planet.dx += gravity;
    }

    if (planet.y > gravityY) {
      planet.dy -= gravity;
    }
    else {
      planet.dy += gravity;
    }
    
    if (planet.z > gravityZ) {
      planet.dz -= gravity;
    }
    else {
      planet.dz += gravity;
    }

    return planet;
  }

  function _boundaryCheck(planet) {
    if (planet.x < 0) {
      planet.dx *= -1;
      planet.x = 0;
    }
    else if (planet.x > WORLD_WIDTH) {
      planet.x = WORLD_WIDTH;
      planet.dx *= -1;
    }

    if (planet.y < 0) {
      planet.y = 0;
      planet.dy *= -1;
    }
    else if (planet.y > WORLD_HEIGHT) {
      planet.y = WORLD_HEIGHT;
      planet.dy *= -1;
    }
  
    if (planet.z < 0) {
      planet.z = 0;
      planet.dz *= -1;
    }
    else if (planet.z > WORLD_DEPTH) {
      planet.z = WORLD_DEPTH;
      planet.dz *= -1;
    }

    return planet;
  }

  function generatePlanets(total) {
    var planets = [];
    for(var i=0; i<total; i++) {
      var x = Math.floor(Math.random() * WORLD_WIDTH);
      var y = Math.floor(Math.random() * WORLD_HEIGHT);
      var z = Math.floor(Math.random() * WORLD_DEPTH);
      var dx = Math.floor(Math.random() * 1) - 1;
      var dy = Math.floor(Math.random() * 1) - 1;
      var dz = Math.floor(Math.random() * 1) - 1;
      var radius = Math.floor(Math.random() * 5) + 1;
      //var color = '#'+Math.floor(Math.random()*16777215).toString(16);
      var color = getRandomRGBA();
      planets.push(new Planet(x, y, z, dx, dy, dz, radius, color));
    }
    return planets;
  }

  function clearCanvas() {
    context.clearRect(0,0,WORLD_WIDTH, WORLD_HEIGHT);
  }

  function update() {
    WORLD_HEIGHT = window.innerHeight;
    WORLD_WIDTH = window.innerWidth;
    var canvas = document.getElementById(canvasId);
    if (canvas.height != WORLD_HEIGHT) {
      canvas.height = WORLD_HEIGHT;
      canvas.width = WORLD_WIDTH;
    }
    planets.forEach(move);
    //clearCanvas();
    planets.forEach(draw);
  }
  
  function color() {
    return Math.floor(Math.random()*256); 
  }
  
  function getRandomRGBA() {
    return `rgba(${color()},${color()},${color()},1)`;
  }

  var planets = generatePlanets(4);
  setInterval( update, 1);
}
