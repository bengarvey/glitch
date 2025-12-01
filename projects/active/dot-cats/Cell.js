/* globals

COLOR
randomColor

*/

function Cell() {
  this.entities = [];
  this.color = COLOR.BLANK;
  this.value = 0;
  this.isHover = false;
  
  this.push = function(item) {
    this.entities.push(item); 
  }
  
  this.reset = function() {
    this.entities = []; 
    this.isHover = false;
  }
}