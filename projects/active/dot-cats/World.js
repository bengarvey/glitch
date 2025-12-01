/* globals 

Cat
CatGenerator 
Clan
COLOR
Draw
Entity
EntityGenerator
EntityEncounter
Grid
HoverMenu
Prey
PreyGenerator
Score
ScoreBar
Territory
TerritoryGenerator

getOffset
isColliding

*/

var World = function(canvasId) {

  var catGen = new CatGenerator();
  var clan = new Clan();

  var VIEW_HEIGHT = window.innerHeight;
  var VIEW_WIDTH = window.innerWidth;
  var WORLD_WIDTH = VIEW_WIDTH;
  var WORLD_HEIGHT = VIEW_HEIGHT;
  var GRID_SIZE = 20;
  var VIEW_X = 0;
  var VIEW_Y = 0;
  
  var gravityX = WORLD_WIDTH / 2;
  var gravityY = WORLD_HEIGHT / 2;
  var gravity = 0.0;
  
  var pause = false;
  
  var time = 0;
  var isHover = false;
  var hoverLoc = null;
  
  var health = 0;
  this.mouseLoc = {x:0, y:0};

  // Get the canvas element we need
  var drawing_canvas = document.getElementById(canvasId);

  function handleClick(event) {
    gravityX = event.clientX;
    gravityY = event.clientY;
  }

  // Initaliase a 2-dimensional drawing context
  var context = drawing_canvas.getContext('2d');

  function drawText(x, y, string, color) {
    var loc = toView(x,y);
    context.font = "14px Arial";
    draw.text(loc.x, loc.y, string, color);
  }
  
  function drawIcon(x, y, src, size) {
    var loc = toView(x, y);
    var image = new Image();
    image.src = src;
    context.drawImage(image, loc.x, loc.y, size, size); 
  }
  
  function drawCat(cat) {
    var loc = toView(cat.x, cat.y);
    draw.cat(loc.x, loc.y, cat, false);
  }
  
  function drawPrey(prey) {
    var loc = toView(prey.x, prey.y);
    draw.entity(loc.x, loc.y, prey, false);
    //draw.circle(loc.x, loc.y, prey.radius, prey.color, prey.color); 
  }
  
  function drawTerritory(terr) {
    var loc = toView(terr.x, terr.y);
    context.globalAlpha = 0.2;
    draw.circle(loc.x, loc.y, terr.radius, terr.color, terr.color); 
    context.globalAlpha = 1;
    context.globalAlpha = 1;
  }
  
  function drawGrid() {
    _drawSquares();
    _drawHorizontalGrid();
    _drawVerticalGrid();
    
  }
  
  function _drawSquares() {
    for (var i=0; i<grid.grid.length; i++) {
      if (typeof(grid.grid[i]) !== 'undefined') {
        for (var j=0; j<grid.grid[i].length; j++) {
          if (typeof(grid.grid[i][j]) !== 'undefined') {
            var loc = toView(i*GRID_SIZE, j*GRID_SIZE);
            var color = grid.grid[i][j].color;
            if (color === COLOR.PLANT) {
              var alpha = grid.grid[i][j].value / 100;
              alpha = alpha < 0 ? 0 : alpha;
              alpha = alpha > 100 ? 100 : alpha;
              color = `rgba(119, 238, 119, ${alpha})`;
              // Draw dirt here
            }
            draw.rect(loc.x, loc.y, 
                      GRID_SIZE, 
                      GRID_SIZE, color);            
            if (grid.grid[i][j].entities.length > 0) {
              draw.rect(loc.x, loc.y, 
                        GRID_SIZE, 
                        GRID_SIZE, 'rgba(10,10,10,0.1)');
            }
          }
        }
      }
    }
  }
  
  function _drawHorizontalGrid() {
    for(var i=0; i<WORLD_HEIGHT; i+=GRID_SIZE) {
      var start = toView(0, i);
      var end = toView(WORLD_WIDTH, i);
      draw.line(start.x, start.y, end.x, end.y, '#eee');
    }    
  }
  
  function _drawVerticalGrid() {
    for(var i=0; i<WORLD_WIDTH; i+=GRID_SIZE) {
      var start = toView(i, 0);
      var end = toView(i,WORLD_HEIGHT);
      draw.line(start.x, start.y, end.x, end.y, '#eee');
    }    
  }

  function drawEnt(entity, index, entities) {
    if (entity.type === 'cat') {
      drawCat(entity);
      drawText(entity.x+5, entity.y-5, entity.getName(), entity.clan.color);
    }
    else if (entity.type === 'prey') {
      drawPrey(entity); 
    }

    var icon = entity.getIcon();
    
    if (icon != '') {
      var size = (entity.getRadius()*2) - 10;
      var offset = Math.floor(size/2);
      drawIcon(entity.x-offset, entity.y-offset, icon, size);
    }
  }

  function _boundaryCheck(entity) {
    if (entity.x < 0) {
      entity.dx *= -1;
      entity.x = 0;
    }
    else if (entity.x > WORLD_WIDTH) {
      entity.x = WORLD_WIDTH;
      entity.dx *= -1;
    }

    if (entity.y < 0) {
      entity.y = 0;
      entity.dy *= -1;
    }
    else if (entity.y > WORLD_HEIGHT) {
      entity.y = WORLD_HEIGHT;
      entity.dy *= -1;
    }

    return entity;
  }
  
  function _territoryCheck(cat) {
    if (isColliding(cat, cat.clan)) {
      cat.state += 1;
      if (cat.holding.length > 0 && isColliding(cat, cat.clan, true)) {
        cat.holding.forEach((p) => { entities.push(p) });
        cat.holding.length = 0; 
      }
    }
    else {
      cat.state += -1; 
    }
  }
  
  function clearCanvas() {
    context.clearRect(0,0,VIEW_WIDTH, VIEW_HEIGHT);
  }

  function update() {
    health = 0;
    VIEW_HEIGHT = window.innerHeight;
    VIEW_WIDTH = window.innerWidth;
    var canvas = document.getElementById(canvasId); 
    if (canvas.height != WORLD_HEIGHT) {
      canvas.height = VIEW_HEIGHT;
      canvas.width = VIEW_WIDTH;
    }
    
    if (!pause) {
      clan.titleCheck(entities.filter( (c) => {return c.type == 'cat'}), territories);
      collisionCheck();
      grid.reset();
      grid.processRandomCells(0.001);
      entities.forEach( (e, i) => {
        e.update(grid);
        grid.push(e);
        health += e.type === 'cat' ? e.state : 0;
        if (e.remove()) {
          entities.splice(i,1);
        }
      });

      if (time % 100 === 0) {
        territories.forEach( function(c) {
          generateNewPrey(250 - entities.length, c);
        });
      }

      time += 1;
      
    }

    clearCanvas();
    drawGrid();
    territories.forEach(drawTerritory);
    entities.forEach(drawEnt);
    scoreBar.draw(score.calculate(entities.filter(e => e.type === 'cat')));
    
    if (isHover && pause) {
      hoverMenu.draw(hoverLoc);
    }

  }
  
  function generateNewKit(clan, mom, dad) {
    var cat = catGen.generateCat(clan, mom, dad);
    entities.push(cat);
  }

  function collisionCheck() {
    grid.grid.forEach( (list) => {
      list.forEach( (col => {
        if (col.entities.length > 0) {
          for(var i=0; i<col.entities.length; i++) {
            for(var j=i+1; j<col.entities.length; j++) {
              processCollision(col.entities[i], col.entities[j]);    
            }
            _territoryCheck(col.entities[i]);
            _boundaryCheck(col.entities[i]);
          }
        }
      }));
    });
  }
  
  function processCollision(a, b) {
    if (a.type === b.type && b.type === 'cat') {
      a.clan === b.clan ? goodInteraction(a,b) : badInteraction(a,b);
    }
    else if (a.type === b.type && b.type === 'prey') {
      goodInteraction(a,b);
    }
    else if (a.type === 'cat' && b.type === 'prey') {
      b.alive ? killEntity(a, b) : eatEntity(a, b);
    }
    else if (a.type === 'prey' && b.type === 'cat') {
      killEntity(b, a);
    }

  }
  
  function badInteraction(a,b) {
    [a, b] = encounter.bad(a, b)
  }
  
  function goodInteraction(a,b) {
    a.state += 3;
    b.state += 3;
  
    // If the cats are both very healthy, make a kit
    var ages = [a.getAgeStatus(), b.getAgeStatus()];
    if (a.type ==='cat' 
        && b.type === 'cat' 
        && ages.indexOf('kit') === -1
        && ages.indexOf('elder') === -1
        && ages.indexOf('apprentice') === -1
        && (a.hunger + b.hunger) > 500
        && entities.length < 300) {

      if (a.gender != b.gender) {
        let mom = a.gender === 'female' ? a : b;
        let dad = a.gender === 'male' ? a : b;
        generateNewKit(a.clan, mom, dad);
      }
      a.hunger -= 100;
      b.hunger -= 100;
    }
  }
  
  function killEntity(predator, prey) {
    if (prey.alive) {
      prey.alive = false;
      predator.state += 3;
      predator.add(prey);
    }
  }
  
  function eatEntity(predator, prey) {
    // Don't eat if holding or if not hungry
    if (predator.holding.indexOf(prey) < 0 && predator.hunger < 0) {
      predator.hunger += prey.state;
      prey.state += -100;
    }
  }
  
  function generateNewPrey(total, territory) {
    var prey = entGen.generate(total, territory, 'prey');
    entities = entities.concat(prey);    
  }
  
  // toV = toViewCoordinates
  function toView(x, y) {
    return { x: x - VIEW_X, y: y - VIEW_Y };
  }
  
  document.onkeydown = checkKey;
  function checkKey(e) {
      e = e || window.event;
      if (e.keyCode == '38') {
          // up arrow
          VIEW_Y += -50;
      }
      else if (e.keyCode == '40') {
          // down arrow
          VIEW_Y += 50;
      }
      else if (e.keyCode == '37') {
          // left arrow
          VIEW_X += -50;
      }
      else if (e.keyCode == '39') {
         // right arrow
         VIEW_X += 50;
      }
      else if (e.keyCode == '32') {
         // spacebar
         pause = !pause;
      }
  }
  
  document.onclick = checkClick;
  function checkClick(e) {
    grid.setCell(grid.getCell(e.offsetX, e.offsetY));
  }
  
  document.onmousemove = checkHover;
  
  function checkHover(e) {
    var cell = grid.getCell(e.clientX, e.clientY);
    hoverLoc = {
      cell: cell,
      x: 100,
      y: 100
    }
    this.mouseLoc = {
      x: e.clientX,
      y: e.clientY
    };
    isHover = true;
  }
  
  var terGen= new TerritoryGenerator();
  var grid = new Grid(WORLD_WIDTH, WORLD_HEIGHT, GRID_SIZE);
  grid.init();
  
  var entGen = new PreyGenerator(grid);
  var hoverMenu = new HoverMenu(context);
  var draw = new Draw(context);
  var scoreBar = new ScoreBar(context);
  var score = new Score();
  var encounter = new EntityEncounter();

  var territories = terGen.generate(3, WORLD_HEIGHT, WORLD_WIDTH);
  var entities = [];
  territories.forEach( function(terr) {
    var territoryEnts = catGen.generate(6,terr);
    entities = entities.concat(territoryEnts);
  });
  
  setInterval( update, 30);
}
