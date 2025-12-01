var World = function(canvasId) {

  var WORLD_HEIGHT = window.innerHeight;
  var WORLD_WIDTH = window.innerWidth;
 
  const ROW_SIZE = Math.floor((window.innerWidth - 50)/60);
  const ROW_COUNT = Math.floor((window.innerHeight - 50)/60)
  const TOTAL_TILES = ROW_SIZE * ROW_COUNT;
  const GRID_X = 50;
  const GRID_Y = 50;
  const TILE_MARGIN = 8;
  const TILE_WIDTH = 50;
  const TILE_HEIGHT = 50;
  
  //var gravityX = WORLD_WIDTH / 2;
  //var gravityY = WORLD_HEIGHT / 2;
  var gravity = 0.1;
  const SNAP_THRESHOLD = 75;
  
  const COLOR  = '#009933';
  const GREEN  = '#009933';
  const BLUE   = '#003399';
  const YELLOW = '#999900';
  
  function handleClick(event) {
    tiles = tiles.forEach( tile => tile.dx = Math.random() * 5 - 10);
  }

  // Get the canvas element we need
  console.log(canvasId, 'hi');
  var drawing_canvas = document.getElementById(canvasId);

  // Initaliase a 2-dimensional drawing context
  var context = drawing_canvas.getContext('2d');

  function drawCircle(x, y, radius, color) {
    context.beginPath();
    context.strokeStyle = color;
    context.arc(x, y, radius, 0, Math.PI*2, true);
    context.closePath();
    context.lineWidth = 2;
    context.stroke();
  }
  
  function drawRect(x, y, width, height, color) {
    context.beginPath();
    context.rect(x, y, width, height);
    context.strokeStyle = color;
    context.fillStyle = 'rgba(255,255,255,1)';
    context.lineWidth = 4;
    context.stroke();
    context.fill();
  }

  function drawLine(startX, startY, endX, endY, color) {
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX,endY);
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.stroke();
  }
  
  function drawBarChart(x, y, height, width) {
    drawRect(x+7, y + height - 5, 8, height * -1 * 0.6, GREEN);
    drawRect(x+22, y + height - 5, 8, height * -1 * 0.8, YELLOW);
    drawRect(x+37, y + height - 5, 8, height * -1 * 0.4, BLUE);
  }
  
  function drawLineChart(x, y, height, width) {
    drawLine(x+3, y+height - 10, x+15, y+height - 25, GREEN);
    drawLine(x+15, y+height - 25, x+30, y+height - 5, GREEN);
    drawLine(x+30, y+height - 5, x+45, y+height - 40, GREEN);
  }
  
  function drawNetworkChart(x, y, height, width) {
    drawCircle(x + width/2, y + height/2, 8, COLOR);
    drawLine(x + width/2 + 5, y+height/2 + 5, x + width/2 + 15, y+height/2 + 15, COLOR);
    drawCircle(x + width/2 + 17, y+height/2 + 17, 4, COLOR);
    drawLine(x + width/2 - 5, y+height/2 + 5, x + width/2 - 12, y+height/2 + 12, COLOR);
    drawCircle(x + width/2 - 12, y+height/2 + 12, 2, COLOR);  
    drawLine(x + width/2 + 5, y+height/2 - 5, x + width/2 + 10, y+height/2 - 10, COLOR);
    drawCircle(x + width/2 + 12, y+height/2 - 12, 2, COLOR);   
    drawLine(x + width/2 - 5, y+height/2 - 5, x + width/2 - 12, y+height/2 - 12, COLOR);
    drawCircle(x + width/2 - 14, y+height/2 - 14, 4, COLOR);  
  }

  function Tile(x, y, dx, dy, cx, cy, height, width, type, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.cx = cx;
    this.cy = cy;
    this.width = height;
    this.height = width;
    this.type = type;
    this.color = color;
  }

  function draw(tile, index, tiles) {
    drawTile(tile);
  }
  
  function drawTile(tile) {
    drawRect(tile.x, tile.y, tile.width, tile.height, tile.color);
    switch (tile.type) {
      case 'bar':
        drawBarChart(tile.x, tile.y, tile.width, tile.height);
        break;
      case 'line':
        drawLineChart(tile.x, tile.y, tile.width, tile.height);
        break;
      case 'network':
        drawNetworkChart(tile.x, tile.y, tile.width, tile.height);
        break;
      default:
        drawBarChart(tile.x, tile.y, tile.width, tile.height);    
    }
  }

  function move(tile) {
    tile.x += tile.dx;
    tile.y += tile.dy;

    // gravity check
    tile = _gravityCheck(tile, gravity, tile.cx, tile.cy);
    //tile = _boundaryCheck(tile);
    //tile = _snapCheck(tile);

  }

  function _gravityCheck(planet, gravity, gravityX, gravityY) {
    if (planet.x > gravityX) {
      planet.dx -= gravity;
    }
    else {
      planet.dx += gravity + 0.3;
    }

    if (planet.y > gravityY) {
      planet.dy -= gravity;
    }
    else {
      planet.dy += gravity + 0.3;
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
  
  function _snapCheck(tile) {

    if (Math.abs(tile.x - tile.cx) < SNAP_THRESHOLD && Math.abs(tile.y - tile.cy) < SNAP_THRESHOLD) {
      tile.x = tile.cx;
      tile.y = tile.cy;
      tile.dx = 0;
      tile.dy = 0;
    } 
  }

  function generateTiles(total) {
    var tiles = [];

    for(var i=0; i<total; i++) {
      var x = Math.floor(Math.random() * WORLD_WIDTH);
      var y = Math.floor(Math.random() * WORLD_HEIGHT);
      var dx = Math.floor(Math.random() * 2) - 1;
      var dy = Math.floor(Math.random() * 2) - 1;
      var gx = i % ROW_SIZE;
      var gy = Math.floor(i / ROW_SIZE);
      var cx = GRID_X + TILE_WIDTH * gx + TILE_MARGIN * gx;
      var cy = GRID_Y + TILE_HEIGHT * gy + TILE_MARGIN * gy;
      x = cx;
      y = cy;
      tiles.push(new Tile(x, y, dx, dy, cx, cy, TILE_WIDTH, TILE_HEIGHT, getRandomType(), '#000000'));
    }
    return tiles;
  }
  
  function getRandomType() {
    const types = ['bar', 'line', 'network'];
    return types[Math.round(Math.random() * types.length)];
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
    tiles.forEach(move);
    clearCanvas();
    tiles.forEach(draw);
  }

  var tiles = generateTiles(TOTAL_TILES);
  setInterval( update, 20);
}
