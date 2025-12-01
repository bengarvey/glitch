/* globals

Cat
Dna
Entity
NameGenerator
Prey

getOffset
randomItem

*/

var EntityGenerator = function() {
  this.ng = new NameGenerator();
  
  this.generateEntity = function(home, type) {
    var x = home.x + getOffset(50);
    var y = home.y + getOffset(50);
    var dx = 1;
    var dy = 1;
    var radius = 10;
    var color = home.color;
    var name = "MOUSE";
    var title = ' ';
    var age = 0;
    var type = type;
    var dna = new Dna([], [])
    var entity = this.get(x, y, dx, dy, radius, color, name, title, age, home, type, dna); 
    
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

  this.get = function(x, y, dx, dy, radius, color, name, title, age, home, type, dna, secondaryColor) {
    if (type === 'cat') {
      let gender = randomItem(['male', 'female']);
      return new Cat(x, y, dx, dy, radius, color, name, title, age, home, type, gender);
    }
    else if (type === 'prey') {
      return new Prey(x, y, dx, dy, radius, color, name, title, age, home, type, null, secondaryColor);
    }
    else {
      return new Entity(x, y, dx, dy, radius, color, name, title, age, home, type); 
    }
  }
  
  return this;
}