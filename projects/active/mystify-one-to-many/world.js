var World = function(canvasId) {

  var WORLD_HEIGHT = window.innerHeight;
  var WORLD_WIDTH = window.innerWidth;
  var gravityX = WORLD_WIDTH / 2;
  var gravityY = WORLD_HEIGHT / 2;
  var gravity = 0.05;
  var maxd = 500;

  // Get the canvas element we need
  console.log(canvasId, 'hi');
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
    context.lineWidth = randomInt(20);
    context.stroke();
  }

  function Planet(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;
  }

  function draw(planet, index, planets) {
    drawCircle(planet.x, planet.y, planet.radius, planet.color);
    if (index > 0) {
      let randomPlanet = planets[randomInt(planets.length)];
      drawLine(randomPlanet.x, randomPlanet.y, planet.x, planet.y, planet.color);
      //drawCircle(planet.x, planet.y, previous.x - planet.x, planet.color);
    }
  }
  
  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function move(planet) {
    planet.x += planet.dx;
    planet.y += planet.dy;

    // gravity check
    planet = _gravityCheck(planet, gravity, gravityX, gravityY);
    if (planet.dx > maxd) {
      planet.dx = maxd;
    }
    
    if (planet.dy > maxd) {
      planet.dy = maxd;
    }
    
    if (planet.dx < maxd * -1) {
      planet.dx = maxd * -1;
    }
    
    if (planet.dy < maxd * -1) {
      planet.dy = maxd * -1;
    }

  }

  function _gravityCheck(planet, gravity, gravityX, gravityY) {
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

    return planet;
  }

  function generatePlanets(total) {
    var planets = [];
    for(var i=0; i<total; i++) {
      var x = Math.floor(Math.random() * WORLD_WIDTH);
      var y = Math.floor(Math.random() * WORLD_HEIGHT);
      var dx = Math.floor(Math.random() * 5) - 1;
      var dy = Math.floor(Math.random() * 5) - 1;
      var radius = Math.floor(Math.random() * 1) + 1;
      var color = '#'+Math.floor(Math.random()*16777215).toString(16);
      planets.push(new Planet(x, y, dx, dy, radius, color));
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

  var planets = generatePlanets(6);
  setInterval( update, 0);
}
