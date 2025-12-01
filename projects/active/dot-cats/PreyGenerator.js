/* globals

EntityGenerator
Prey

getOffset
randomColor
randomInt
randomItem

*/

const typeColors = {
  mouse: ['#919396'],
  bird: ['#fff356'],
  frog: ['#00b740', '#94b082'],
  chipmunk: ['#af620a'],
  fish: ['#35ddff'],
  squirrel: ['#8e6341'],
  bug: ['#211b17'],
  rabbit:['#f2f1ed']
};

function randomType() {
  return randomItem(Object.keys(typeColors));
}

var PreyGenerator = function() {
  EntityGenerator.call(this);
  
  this.generateEntity = function(home, type) {
    
    var preyType = randomType();
    
    var x = window.innerWidth/2 + getOffset(25);
    var y = window.innerHeight/2 + getOffset(25);
    var dx = 1;
    var dy = 1;
    var radius = randomInt(1,4);
    var color = typeColors[preyType][0];
    var secondaryColor = typeColors[preyType].length > 1 ? typeColors[preyType][1] : typeColors[preyType][0];
    var name = preyType;
    var title = ' ';
    var age = 0;
    this.type = 'prey';
    debugger;
    var entity = this.get(x, y, dx, dy, radius, color, name, title, age, home, type, null, secondaryColor); 
    
    if (['frog','fish', 'bird','bug'].indexOf(name) > -1) {
      entity.likesWater = true; 
    }

  
    return entity;
  }
  
  this.generate = function(total, home, type) {
    var entities = [];
    for(var i=0; i<total; i++) {
      var entity = this.generateEntity(home, type);
      entities.push(entity);
    }
    return entities;
  }
  
  return this;
}