/* globals
  
  Draw
  
*/

var World = function(canvasId) {

  var WORLD_HEIGHT = window.innerHeight;
  var WORLD_WIDTH = window.innerWidth;
  var gravityX = WORLD_WIDTH / 2;
  var gravityY = (WORLD_HEIGHT);
  var gravity = 0.05;

  // Get the canvas element we need
  console.log(canvasId, 'hi');
  var drawing_canvas = document.getElementById(canvasId);
  
  function handleClick(event) {
    gravityX = event.clientX;
    gravityY = event.clientY;
  }

  // Initaliase a 2-dimensional drawing context
  var context = drawing_canvas.getContext('2d');
  var d = new Draw(context);

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
    drawCircle(planet.x, planet.y, planet.radius, planet.color);
    if (index > 0) {
      var previous = planets[index-1];
      drawLine(previous.x, previous.y, planet.x, planet.y, planet.color);
    }
  }

  function move(planet) {
    planet.x += planet.dx;
    planet.y += planet.dy;

    // gravity check
    planet = _gravityCheck(planet, gravity, gravityX, gravityY);

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

    if (planet.y < WORLD_HEIGHT) {
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
      var x = Math.floor(Math.random() * WORLD_WIDTH/4);
      var y = Math.floor(Math.random() * WORLD_HEIGHT/2) + WORLD_HEIGHT;
      var dx = Math.floor(Math.random() * 2) - 1;
      var dy = Math.floor(Math.random() * 2) - 1;
      var radius = Math.floor(Math.random() * 2) + 1;
      //var color = '#'+Math.floor(Math.random()*16777215).toString(16);
      var color = Math.random() > 0.5 ? '#6666ff' : '#ffffff';
      planets.push(new Planet(x, y, dx, dy, radius, color));
    }
    return planets;
  }
  
  function generateGridPlanets() {
    var planets = [];
    planets.push(new Planet(0, (WORLD_HEIGHT/4)*3, 5, 5, 2, '#ffffff'));
    planets.push(new Planet(WORLD_WIDTH, (WORLD_HEIGHT/4)*3, 5, -5, 2, '#ffffff'));

    planets.push(new Planet(0, (WORLD_HEIGHT/4)*3, 5, 5, 2, '#ffffff'));
    planets.push(new Planet(0, WORLD_HEIGHT, 5, 5, 2, '#ffffff'));
    
    planets.push(new Planet(0, (WORLD_HEIGHT/4)*3, 4, 4, 2, '#6666ff'));
    planets.push(new Planet(0, WORLD_HEIGHT, 4, 4, 2, '#6666ff'));
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
    if (count < 3) {
      d.image('https://cdn.glitch.com/1bd03cb6-3462-41cc-9a38-13e78d7e35b2%2Fhouse.jpg?v=1617851340882', WORLD_WIDTH, WORLD_HEIGHT);
      count += 1;
    }
    planets.forEach(draw);
  }
  var first = true;
  var planets = generateGridPlanets();
  setInterval( update, 20);
  var count = 0;

}
