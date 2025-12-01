function Notes() {

  var notes = {};
  var chords = ['A','B','C','D','E','F','G','em','am'];

  notes.getProgression = function(total) {
    var progression = [];
    for(var i=0; i<total; i++) {
      progression.push(chords[Math.round(Math.random()*chords.length)]);
    }
    return progression;
  }

  return notes;
}

var notes = new Notes();
console.log(notes.getProgression(4));


