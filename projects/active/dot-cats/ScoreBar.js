/* globals

COLOR
Draw

*/

function ScoreBar(context) {
  
  const width = window.innerWidth;
  const height = 10;
  const x = 10;
  const y = 30;
  const transparency = 0.5;
  const barYOffset = 10;
  const maxScore = 1000000;

  var draw = new Draw(context);
  
  this.draw = function(score) {
    draw.text(x, y, "Happiness", COLOR.TEXT, 20);
    draw.rect(x, y + barYOffset, (score/maxScore) * width, height, COLOR.SUCCESS);
  }
  

  
}