var art = require('ascii-art');
// Set file path to where the font files are stored
art.Figlet.fontPath = __dirname + '/fonts/';

// Setup the ascii image
var image = new art.Image({
	filepath: __dirname + '/assets/glitch.png',
	alphabet: 'variant2'
});

// Render the text
art.font('  G L I T C H  ', '3-d', function(rendered){
  console.log(rendered);
  // Display the ascii image
  image.write(function(err, rendered){
	  console.log(rendered);
  });
});