function Gravity(gravity) {
  this.g = gravity;
  this.maxf = 10;
  this.maxVelocity = 30;

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
    if (c1.position.x < c2.position.x) {
      c1.velocity.x = c1.velocity.x + f1;
      c2.velocity.x = c2.velocity.x - f2;
    }
    else if (c1.position.x > c2.position.x) {
      c1.velocity.x = c1.velocity.x - f1;
      c2.velocity.x = c2.velocity.x + f2;
    }

    if (c1.position.y < c2.position.y) {
      c1.velocity.y = c1.velocity.y + f1;
      c2.velocity.y = c2.velocity.y - f2;
    }
    else if (c1.position.y > c2.position.y) {
      c1.velocity.y = c1.velocity.y - f1;
      c2.velocity.y = c2.velocity.y + f2;
    }
    
    if (c1.position.z < c2.position.z) {
      c1.velocity.z = c1.velocity.z + f1;
      c2.velocity.z = c2.velocity.z - f2;
    }
    else if (c1.position.z > c2.position.z) {
      c1.velocity.z = c1.velocity.z - f1;
      c2.velocity.z = c2.velocity.z + f2;
    }

    return [c1, c2];
  }

  this.calculate = function(c1, c2) {
    var d = Math.sqrt( ((c2.position.y - c1.position.y)*(c2.position.y - c1.position.y)) 
                      + ((c2.position.x - c1.position.x)*(c2.position.x - c1.position.x)) 
                      + ((c2.position.z - c1.position.z)*(c2.position.z - c1.position.z)));
    
    var f = this.g * (c1.geometry.parameters.radius * c2.geometry.parameters.radius/ (d*d));

    var f1 = 0;
    var f2 = 0;

    f2 = (c1.geometry.parameters.radius / (c1.geometry.parameters.radius+c2.geometry.parameters.radius) * f);
    f1 = (c2.geometry.parameters.radius / (c1.geometry.parameters.radius+c2.geometry.parameters.radius) * f);
    f = limit(f, this.maxf * -1, this.maxf);

    var arr = adjustDirection(c1, c2, f1, f2);
    var c1 = arr[0];
    var c2 = arr[1];

    c1.velocity.x = limit(c1.velocity.x, this.maxVelocity * -1, this.maxVelocity);
    c2.velocity.x = limit(c2.velocity.x, this.maxVelocity * -1, this.maxVelocity);
    c1.velocity.y = limit(c1.velocity.y, this.maxVelocity * -1, this.maxVelocity);
    c2.velocity.y = limit(c2.velocity.y, this.maxVelocity * -1, this.maxVelocity);
    c1.velocity.z = limit(c1.velocity.z, this.maxVelocity * -1, this.maxVelocity);
    c2.velocity.z = limit(c2.velocity.z, this.maxVelocity * -1, this.maxVelocity);

    return [c1, c2];
  }
}
