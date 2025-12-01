/* globals


*/

var EntityEncounter = function() {
  
  this.bad = function(a, b) {
    if (a.alive && b.alive) {
      if (a.state > b.state) { 
        b.alive = false;
        console.log(`${a.name} killed ${b.name}!`);
      }
      else {
        a.alive = false;
        console.log(`${b.name} killed ${a.name}!`); 
      }
    }
    return [a, b];
  }
}