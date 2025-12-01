/* globals

Territory

randomInt
randomItem

*/

var TerritoryGenerator = function() {
  
  const names = ["Thunder","River","Shadow","Wind"];
  const colors = ["#aaffaa", "#ffaaaa", "#aaaaff"];
  
  this.generate = function(total, height, width) {
    var territories = [];
    var maxHeight = height
    var maxWidth = width;
    for(var i=0; i<total; i++) {
      var territory = new Territory(
        i,
        randomInt(100,maxWidth), 
        randomInt(100,maxHeight), 
        40, getName(), 
        getColor());
      territories.push(territory);
    }
    return territories;
  }
  
  function getName() {
    return randomItem(names);
  }
  
  function getColor() {
    return `#${Math.floor(Math.random()*16777215).toString(16)}`;
  }
  
  return this;
}