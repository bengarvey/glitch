function Band() {

  var band = {};

  band.getName = function() {
    return "The Carnivorous Dandelions";
  }

  return band;
}

var band = new Band();
console.log(band.getName());


