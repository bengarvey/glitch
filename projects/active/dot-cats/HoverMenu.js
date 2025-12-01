/* globals

COLOR
Draw

*/

function HoverMenu(context) {
  const width = 350;
  const height = 250;
  const transparency = 0.5;
  
  this.last = null;

  var draw = new Draw(context);
  this.draw = function(loc) {
    
    if (getEnts(loc.cell) < 1) {
      loc = this.last;
    }
    
    var ents = getEnts(loc.cell);
    if (ents.length > 0) {
      
      this.last = loc;
      loc = transformLoc(loc);
      draw.rect( 
        loc.x, loc.y,
        width, height, 
        'rgba(255,255,255,0.8)'
      );
      var ent = ents[0];
   
      drawPolarChart(draw, loc, ent);
      drawTitle(draw, loc, ent);
      drawEnt(draw, loc, ent);
      drawGender(draw, loc, ent);
    }

  }
  
  function transformLoc(loc) {
    loc.x = window.innerWidth < loc.x + width ?
      loc.x - width : loc.x;
    loc.y = window.innerHeight < loc.y + height ?
      loc.y - height : loc.y;
    return loc;
  }
  
  function drawStats(draw, loc, cat) {                         
    draw.text(loc.x + 5, loc.y + 25, 
              JSON.stringify(cat.getPersonality(), null, 2), COLOR.TEXT);
  }
  
  function drawTitle(draw, loc, ent) {
    draw.text(loc.x + 5, loc.y + 30, ent.getName(), COLOR.TEXT, 40); 
  }
  
  function drawGender(draw, loc, ent) {
    draw.text(loc.x + 235, loc.y + 220, ent.gender, COLOR.TEXT, 15); 
  }
  
  function drawCat(draw, loc, cat) {
    draw.cat(loc.x + 250, loc.y + 120, cat, true);   
  }
  
  function drawPrey(draw, loc, ent) {
    draw.entity(loc.x + 250, loc.y + 120, ent, true);
    //draw.circle(loc.x + 250, loc.y + 120, 40, ent.color, ent.color);   
  }
  
  function drawEnt(draw, loc, ent) {
    switch(ent.type) {
      case 'cat':
        drawCat(draw, loc, ent);
        break;
      case 'prey':
        drawPrey(draw, loc, ent);
        break;
    }
  }
  
  function drawPolarChart(draw, loc, cat) {
    var personality = cat.getPersonality();
    var keys = Object.keys(personality);
    var step = 2 * Math.PI / keys.length;
    var coordinates = [];
    for(var i=0; i<keys.length; i++) {
      var percent = (personality[keys[i]] + 10) / 20;
      coordinates.push(getPolarChartPosition(loc, step * i, percent));
    }
    for(i=0; i<coordinates.length-1; i++) {
      draw.line(coordinates[i].x, coordinates[i].y,
                coordinates[i+1].x, coordinates[i+1].y,
                COLOR.TEXT);
      var textCoords = getPolarChartPosition(loc, step * i, 2)
      draw.text(textCoords.x-20, textCoords.y+5, keys[i], COLOR.TEXT);
    }
    i = coordinates.length - 1;
    draw.line(coordinates[i].x, coordinates[i].y,
          coordinates[0].x, coordinates[0].y,
          COLOR.TEXT);
    var textCoords = getPolarChartPosition(loc, step * i, 2)
    draw.text(textCoords.x - 20, textCoords.y + 5, keys[i], COLOR.TEXT);
    draw.circle(loc.x + 100, loc.y + 120, 40, COLOR.TRANSPARENT, COLOR.GRID);
    draw.circle(loc.x + 100, loc.y + 120, 20, COLOR.TRANSPARENT, COLOR.GRID);
  }
  
  function getPolarChartPosition(loc, angle, percent) {
    var h = loc.x + 100;
    var k = loc.y + 120;
    var r = 40 * percent;
    var x = r * Math.cos(angle) + h;
    var y = r * Math.sin(angle) + k; 
    
    return {x: x, y: y};
  }
  
  function getEnts(cell) {
    var cats = [];
    return cell.entities;
  }
  
  function getCats(cell) {
    var cats = [];
    return cell.entities.filter( (ent) => { return ent.type === 'cat' } );
  }
}