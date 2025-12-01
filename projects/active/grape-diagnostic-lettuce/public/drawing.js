window.onload = function() {
  const canvas = document.getElementById('paper');
  paper.setup(canvas);

  drawRotatingRectangle();
}


/**
 * stupid pink rectangle that rotates
 *
 */
function drawRotatingRectangle() {
  const path = new paper.Path.Rectangle([200, 200], [500, 150]);

  path.strokeColor = '#ff0099';

  const start = new paper.Point(100, 100);

  paper.view.onFrame = function (e) {
    path.rotate(5);
  }

  paper.view.draw();
}