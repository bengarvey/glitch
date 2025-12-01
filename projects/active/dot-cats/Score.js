/* globals

COLOR
Draw

*/

function Score() {
  
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  
  this.calculate = function(cats) {
    let score = cats.map(cat => cat.getHappiness()).reduce(reducer);
    return score;
  }
  
}