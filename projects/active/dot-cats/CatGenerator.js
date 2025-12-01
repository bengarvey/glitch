/* globals

Cat
Dna
NameGenerator

getOffset
randomItem
CAT_COLORS
avgHex

*/

var CatGenerator = function() {
  this.ng = new NameGenerator();
  
  this.generateCat = function(home, mom = null, dad = null) {
    var gender = randomItem(['male', 'female']);
    var x = home.x + getOffset(50);
    var y = home.y + getOffset(50);
    var dx = 1;
    var dy = 1;
    var radius = 10;
    //var color = mom === null ? randomItem(CAT_COLORS) : mom.color;

    var name = this.ng.getName();
    var title = ' ';
    var age = 0;
    var dna = this.getDna(gender, mom, dad);
    var color = this.getColor(gender, dna);
    var cat = new Cat(x, y, dx, dy, radius, color, name, title, age, home, 'cat', gender, dna); 
    return cat;
  }
  
  this.getDna = function(gender, mom, dad) {


    if (mom === null || dad === null) {
      let color = [randomItem(CAT_COLORS), randomItem(CAT_COLORS)];
      let dilute = [randomItem([true, false]), randomItem([true, false])];
      return new Dna(color, dilute);
    }
    else {
      let dilute = [randomItem(mom.dna.dilute), randomItem(dad.dna.dilute)];
      let color = [randomItem(mom.dna.color), randomItem(dad.dna.color)];
      return new Dna(color, dilute)
    }
  }
  
  this.getColor = function(gender, dna) {
    if (gender === 'male') {
      return dna.color[0];
    }
    else {
      return randomItem(dna.color)
    }
  }
  
  this.generate = function(total, home) {
    var cats = [];
    for(var i=0; i<total; i++) {

      var cat = this.generateCat(home, null, null);
      if (cat.color == '#000000' && !cat.dna.dilute.includes(false)) {
        console.log(cat);
        debugger;
      }
      cats.push(cat);
    }

    // Assign one to be the leader, medicine cat, and deputy
    // and age them appropriately
    if (total > 3) {
      cats[0].title = 'leader';
      cats[1].title = 'deputy';
      cats[2].title = 'medicine';
      
      cats[0].age = 2000;
      cats[1].age = 2000;
      cats[2].age = 2000;
    }
    
    if (total > 4) {
      cats[3].age = 1000; 
    }
    return cats;
  }
  
  return this;
}