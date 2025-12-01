/* globals

  Cell
  COLOR

  randomInt

*/

function Grid(width, height, size) {
  this.width = width;
  this.height = height;
  this.size = size;
  this.grid = [];
  
  var coords = translateGrid(this.width, this.height, this.size);
  this.maxX = coords[0];
  this.maxY = coords[1];
  
  this.push = function(item) {
    var i = Math.round((item.x / this.size)-0.5); 
    var j = Math.round((item.y / this.size)-0.5);

    this.addIfMissing(i,j);
    this.grid[i][j].push(item);
    
  }
  
  this.init = function() {
    var maxWidth = Math.round((this.width / this.size)-0.5); 
    var maxHeight = Math.round((this.height / this.size)-0.5);

    for(var i=0; i<maxWidth; i++) {
      this.grid[i] = [];
      for(var j=0; j<maxHeight; j++) {
        this.grid[i][j] = new Cell();
      }
    }
    
    this.generateLake(4);
    this.generateRiver();
    this.generatePlant(10);
  }
  
  // Pick n% (decimal values) of the grid spaces randomly and see if they are eligible for plants
  // or plant growth
  this.processRandomCells = function(percent) {
    var totalCells = this.maxY * this.maxY * percent;
    for (var i=0; i<totalCells; i++) {
      var x = randomInt(0,this.width);
      var y = randomInt(0,this.height);
      var coords = translateGrid(x, y, this.size);
      var cell = this.getCell(x, y);
      var subGrid = this.getSubGrid(x, y, 2);
      this.plantCheck(cell, subGrid, coords[0], coords[1]);
    }
  }
  
  this.plantCheck = function(cell, subGrid, x, y) {
    
    if (cell.color == COLOR.PLANT) {
      let increment = this.gridContains(subGrid, 'color', COLOR.WATER) ? 20 : 3;
      this.grid[x][y].value += increment;
    }
    else if (cell.color == COLOR.WATER) {
      // do nothing
    }
    else if (cell.color == COLOR.BLANK && this.gridContains(subGrid, 'color', COLOR.PLANT)) {
      this.setPlant(x, y);
    }
  }
  
  this.gridContains = function(grid, key, value) {
    var list = grid.flat();
    var colors = list.map( (item) => item.color);
    return colors.indexOf(value) > -1;
  }
 
  this.reset = function() {
    this.grid.forEach( (line) => {
      line.forEach( (item) => {
        item.reset();
      });
    });
  }
  
  this.getCell = function(x, y) {
    var loc = translateGrid(x, y, this.size);
    this.addIfMissing(loc[0], loc[1]); 
    if (typeof(this.grid[loc[0]][loc[1]]) !== 'undefined') {
      return this.grid[loc[0]][loc[1]];
    }
    else {
       
    }
  }
  
  this.getSubGrid = function(x, y, range) {
    var subGrid = [];
    var loc = translateGrid(x, y, this.size);
    for(var i=loc[0]-range; i<loc[0]+range; i++) {
      subGrid[i] = [];
      if (typeof this.grid[i] != 'undefined') {
        for(var j=loc[1]-range; j<loc[1]+range; j++) {
          if (i > -1 && j > -1 && typeof this.grid[i][j] != 'undefined') {
            subGrid[i].push(this.grid[i][j]);
          }
        }
      }
    }
    return subGrid;
  }
  
  this.addIfMissing = function(i, j) {
    if (typeof(this.grid[i]) === 'undefined') {
      this.grid[i] = []; 
      this.grid[i][j] = new Cell();
    }
    else if (typeof(this.grid[i][j]) === 'undefined') {
      this.grid[i][j] = new Cell();
    }   
  }
  
  this.generatePlant = function(total) {
    var x = 0;
    var y = 0;
    for(var i=0; i<total; i++) {
      this.setPlant(randomInt(0, this.maxX), randomInt(0, this.maxY));
    }
  }
  
  this.generateLake = function(size) {
    var x = randomInt(0,this.maxX);
    var y = randomInt(0,this.maxY);
    
    for(var i=x-size; i<x+size; i++) {
      for(var j=y-size; j<y+size; j++) {
        
        if (Math.random() < i/x && Math.random() < j/y) {
          this.addIfMissing(i,j);
          this.grid[i][j].color = COLOR.WATER; 
        }
      }
    }
  }
  
  this.generateRiver = function() {
    
    // Point 0
    var x0 = randomInt(0, this.maxX);
    var y0 = 0;
    
    // Point 1
    var x1 = randomInt(0, this.maxX);
    var y1 = this.maxY/2;
    
    // Point 2
    var x2 = randomInt(0, this.maxX);
    var y2 = this.maxY;
    
    this.plotRiver(x0, y0, x1, y1);
    this.plotRiver(x1, y1, x2, y2);

  }
  
  this.plotRiver = function(x0, y0, x1, y1) {
    var tmp;
    var steep = Math.abs(y1-y0) > Math.abs(x1-x0);
    if(steep){
      //swap x0,y0
      tmp=x0; x0=y0; y0=tmp;

      //swap x1,y1
      tmp=x1; x1=y1; y1=tmp;
    }

    var sign = 1;
    if(x0>x1){
      sign = -1;
      x0 *= -1;
      x1 *= -1;
    }
    var dx = x1-x0;
    var dy = Math.abs(y1-y0);
    var err = ((dx/2));
    var ystep = y0 < y1 ? 1:-1;
    var y = y0;

  
    for(var x=x0;x<=x1;x++){
      if(!(steep ? this.setWater(y,sign*x) : this.setWater(sign*x,y)));
      err = (err - dy);
      if(err < 0){
        y+=ystep;
        err+=dx;
      }
    }    
  }
  
  this.setCell = function(cell) {
    switch(cell.color) {
      case COLOR.BLANK:
        cell.color = COLOR.WATER;
        break;
      case COLOR.WATER:
        cell.color = COLOR.PLANT;
        break;
      case COLOR.PLANT:
        cell.color = COLOR.BLANK;
        break;
      default:     
        cell.color = COLOR.WATER; 
    }
  }

  this.setWater = function(x,y) {
    this.addIfMissing(x,y);
    this.grid[x][y].color = COLOR.WATER;
  }
  
  this.setPlant = function(x,y) {
    this.addIfMissing(x,y);
    this.grid[x][y].color = COLOR.PLANT;
    this.grid[x][y].value = 10;
  }
  
  function translateGrid(x, y, size) {
    return [
      Math.round((x / size)-0.5),
      Math.round((y / size)-0.5)
    ];
  }
  

  
}
