var World = function(canvasId) {

  var WORLD_HEIGHT = window.innerHeight;
  var WORLD_WIDTH = window.innerWidth;
  var RANDOM_FACTOR = 0;
  var RADIUS = Math.round(Math.random() * 25) + 3;
  var MAX_CYCLES = 100000;
  var counter = 0;
  var gravityX = WORLD_WIDTH / 2;
  var gravityY = WORLD_HEIGHT / 2;
  var gravity = Math.random() * 0.1;

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
    context.lineWidth = 1;
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
    //drawCircle(planet.x, planet.y, planet.radius, planet.color);
    drawRect(planet.x, planet.y, planet.radius, planet.radius, planet.color)
    if (index > 0) {
      var previous = planets[index-1];
      //drawLine(previous.x, previous.y, planet.x, planet.y, planet.color);
      //drawCircle(planet.x, planet.y, Math.abs(previous.x - planet.x)/50, planet.color);
      
    }
  }
  
  function drawRect(x1, y1, x2, y2, color) {
    context.beginPath();
    context.fillStyle = color;
    context.beginPath();
    context.rect(x1, y1, x2, y2);
    context.fill();
  }
  
  function getRandomFactor() {
    return Math.random()*(RANDOM_FACTOR) - (RANDOM_FACTOR/2);
  }

  function move(planet) {
    if (counter < MAX_CYCLES) {
      planet.x += planet.dx + getRandomFactor();
      planet.y += planet.dy + getRandomFactor();

      // gravity check
      planet = _gravityCheck(planet, gravity, gravityX, gravityY);
      counter += 1;
    }
    
    if (planet.y >= WORLD_HEIGHT || planet.dy < 0) {
      counter = MAX_CYCLES;
    }

    console.log(counter);

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
    var rowMax = WORLD_WIDTH / RADIUS;
    for(var i=0; i<total; i++) {
      let row = Math.floor(i / rowMax);
      let col = Math.floor(i % rowMax);
      var x = col * RADIUS;
      var y = row * RADIUS;
      var dx = 0;
      var dy = 0;
      var radius = RADIUS
      var color = '#'+Math.floor(Math.random()*16777215).toString(16);
      planets.push(new Planet(x, y, dx, dy, radius, color));
    }
    return planets;
  }

  function clearCanvas() {
    //context.clearRect(0,0,WORLD_WIDTH, WORLD_HEIGHT);
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

  var total = WORLD_WIDTH / RADIUS;
  var planets = generatePlanets(total);
  setInterval( update, 20);
}
