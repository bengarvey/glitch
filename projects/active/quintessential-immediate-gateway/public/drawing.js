/* globals

  paper

*/

window.onload = function() {
  const canvas = document.getElementById('paper');
  paper.setup(canvas);

  for (let i=0; i<10; i++) {
    drawRotatingRectangle(i);
  }
}


/**
 * stupid pink rectangle that rotates
 *
 */
function drawRotatingRectangle(index) {
  var path = new paper.Path.Rectangle([200 + index, 200], [500, 150]);

  path.strokeColor = '#ff0099';

  var start = new paper.Point(100, 100);

  paper.view.onFrame = function (e) {
    path.rotate(1 + index);
  }

  paper.view.draw();
}