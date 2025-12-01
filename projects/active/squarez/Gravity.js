function Gravity(gravity) {
  this.g = gravity;
  this.maxf = 4;
  this.maxVelocity = 4;

  this.apply = function(list) {
    for(var i=0; i<list.length; i++) {
      for(var j=i+1; j<list.length; j++) {
        var arr = this.calculate(list[i], list[j]);
        list[i] = arr[0];
        list[j] = arr[1];
      }
    }
    return list;
  }

  function limit(value, min, max) {
    if (value > max) {
      value = max;
    }
    else if (value < min) {
      value = min;
    }
    return value;
  }

  function adjustDirection(c1, c2, f1, f2) {
    if (c1.x < c2.x) {
      c1.dx = c1.dx + f1;
      c2.dx = c2.dx - f2;
    }
    else if (c1.x > c2.x) {
      c1.dx = c1.dx - f1;
      c2.dx = c2.dx + f2;
    }

    if (c1.y < c2.y) {
      c1.dy = c1.dy + f1;
      c2.dy = c2.dy - f2;
    }
    else if (c1.y > c2.y) {
      c1.dy = c1.dy - f1;
      c2.dy = c2.dy + f2;
    }

    return [c1, c2];
  }

  this.calculate = function(c1, c2) {
    var d = Math.sqrt( ((c2.y - c1.y)*(c2.y - c1.y)) + ((c2.x - c1.x)*(c2.x - c1.x)) );
    var f = this.g * (c1.r * c2.r/ (d*d));

    var f1 = 0;
    var f2 = 0;

    f2 = (c1.r / (c1.r+c2.r) * f);
    f1 = (c2.r / (c1.r+c2.r) * f);
    f = limit(f, this.maxf * -1, this.maxf);

    [c1, c2] = adjustDirection(c1, c2, f1, f2);

    c1.dx = limit(c1.dx, this.maxVelocity * -1, this.maxVelocity);
    c2.dx = limit(c2.dx, this.maxVelocity * -1, this.maxVelocity);
    c1.dy = limit(c1.dy, this.maxVelocity * -1, this.maxVelocity);
    c2.dy = limit(c2.dy, this.maxVelocity * -1, this.maxVelocity);

    return [c1, c2];
  }
}