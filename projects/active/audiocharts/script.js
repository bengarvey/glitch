/* global Tone chance _ Tonal d3 */
// Set global for whether audio is playing
window.playing = false

// Set the options we can pick from
const possibleKeyCenters = ['A', 'B', 'C', 'C#', 'D', 'E', 'F', 'F#', 'G'] // The possible notes that can be used to determine the key
const possibleModes = ['minor', 'major', 'dorian', 'lydian', 'mixolydian', 'phrygian', 'minor pentatonic', 'major pentatonic', 'locrian pentatonic'] // Some hand-picked pleasant modes
const minVol = -12 // Minimum volume for instruments we create (lower is quieter)

// Pick what we want
let modeChoice = chance.pick(possibleModes)
let keyCenter = chance.pick(possibleKeyCenters)
let timeSignature = chance.pick([3, 4]) // Choose a time signature (x/4) - so 2/4, 3/4, 4/4, 6/4 
let tempo = chance.natural({min: 72, max: 200}) // Tempo in BPM
let errors = chance.floating({min: 0, max: 92}) // The chance for errors (AKA how drunk the robot is)
let currentChord = [] // This changes every loop or whatever
let config = {}

const swing = chance.floating({min: 0, max: 1}) // Global swing, from 0 (0%) to 1 (100%)
const learning = chance.floating({min: 0, max: 1}) // This is just a cheap equivalent of learning - every loop errors (from above) is reduced by this value, eventually it won't make any errors at all
const mode = Tonal.Scale.intervals(modeChoice) // ["1P","2M","3M","5P","6M"]
const chordChoices = Tonal.Scale.chords(modeChoice) // ["11","4","5","7#5sus4","7sus4","9sus4", ...]

function logConfig () {
  // Create a config object and log it
  config = {errors, learning, tempo, keyCenter, timeSignature, modeChoice, mode, chordChoices, currentChord}
  console.log(config)
  $('#config').text(loopRep + ' ' + JSON.stringify(config, null, 2)) 
}

function makeRandomNote (octaveRange = [2,6]) {
  // Sometimes, very rarely, creating a new note sparks an idea for a new chord
  if(chance.bool({likelihood: (errors * 0.01)})) {
   makeRandomChord() 
  }
  
  // Pick a new note from the current chord
  let note = chance.pick(currentChord)
  
  // Opportunities for errors 
  if(chance.bool({likelihood: (errors * 0.5)})) {
    if(chance.bool({likelihood: (errors * 0.5)})){
     note = Tone.Frequency(note).transpose(chance.pick([-1,1]))     
    }
    if(chance.bool({likelihood: (errors)})) {
     note = Tone.Frequency(note).transpose(chance.pick([-13, -12, -7, 1, 2, 3,5,7,12]))   
    }    
  }
  
  // More opportunities for errors
  if (chance.bool()) {
    const transposeArray = [-7, 7, 12, -12]
    if(chance.bool({likelihood: errors})){
      transposeArray.push(chance.integer({min: -15, max: 15}))
    }
    const transposeDistance = chance.pick(transposeArray)
    Tone.Frequency(note).transpose(transposeDistance)
  }
  return note
}

// Build as many notes as requested
function makeRandomChord (maxNotes = 10, octaveRange = [2, 5]) {
  let noteOctave = chance.natural({min: octaveRange[0], max: octaveRange[1]})
  let chordNotes = Tonal.Chord.notes(keyCenter+chance.pick(chordChoices))
  chordNotes = chordNotes.map(n => {
    if(chance.bool()) noteOctave-chance.pick([-1, -2, 1, 2, 3])
    //else if(chance.bool()) noteOctave+chance.pick([1,2,3,5])
    return n + noteOctave
  })
  if(chordNotes.length > maxNotes) {
    chordNotes.slice(0, maxNotes+1)
  }
  currentChord = chordNotes
  return currentChord
}

Tone.Transport.bpm.value = tempo
Tone.Transport.timeSignature.value = timeSignature
Tone.Transport.swing.value = swing

//////////
// Set up our synths
//////////
// Make synth
const synth = new Tone.Synth().toMaster()
// synth.set("detune", -1200);
//a polysynth composed of 6 Voices of Synth
const polySynth = new Tone.PolySynth(6, Tone.Synth).toMaster();
//set the attributes using the set interface
if(chance.bool({likelihood: errors * 0.1})) {
 polySynth.set("detune", chance.natural({max: 500})); 
}
polySynth.set({
  "envelope": {
    attack: chance.floating({min: 0, max: 0.5}),
    decay: chance.floating({min: 0.3, max: 1}),
    sustain: chance.floating({min: 0.3, max: 0.5}),
    // release: 1.71
    release: chance.floating({min: 0.05, max: 3})
  },
  "oscillator": {
    // type: 'sine'
    type: chance.pick(['sine', 'sawtooth', 'triangle'])
  }
})

//var dist = new Tone.Distortion()//.toMaster()

polySynth.volume.value = chance.floating({min: -10, max: -2})

const polySynth2 = new Tone.PolySynth(6, Tone.Synth).toMaster();
//set the attributes using the set interface
if(chance.bool({likelihood: errors * 0.1})) {
 polySynth2.set("detune", chance.natural({max: 500})); 
}
polySynth2.set({
  "envelope": {
    attack: chance.floating({min: 0, max: 1}),
    decay: chance.floating({min: 0.05, max: 1}),
    sustain: chance.floating({min: 0.1, max: 1.5}),
    // release: 1.71
    release: chance.floating({min: 0.1, max: 3})
  },
  "oscillator": {
    // type: 'sine'
    type: chance.pick(['sine', 'sawtooth', 'triangle'])
  }
})

polySynth2.volume.value = chance.floating({min: -20, max: -4})

const polySynth3 = new Tone.PolySynth(6, Tone.Synth)
//set the attributes using the set interface
if(chance.bool({likelihood: errors * 0.1})) {
 polySynth3.set("detune", chance.natural({max: 500})); 
}
polySynth3.set({
  "envelope": {
    attack: chance.floating({min: 0.01, max: 3}),
    decay: chance.floating({min: 0.01, max: 2}),
    sustain: chance.floating({min: 0.01, max: 3}),
    // release: 1.71
    release: chance.floating({min: 0.01, max: 5})
  },
  "oscillator": {
    // type: 'sine'
    type: chance.pick(['sine', 'triangle'])
  }
})

//const feedbackDelay = new Tone.FeedbackDelay('4n', 0.72).toMaster()

polySynth3.volume.value = chance.floating({min: -20, max: -5})

const monoSynth = new Tone.MonoSynth().toMaster();
//set the attributes using the set interface
if(chance.bool({likelihood: errors * 0.1})) {
 monoSynth.set("detune", chance.natural({max: 100})); 
}
monoSynth.set({
  "envelope": {
    attack: chance.floating({min: 0, max: 1}),
    decay: chance.floating({min: 0.05, max: 1}),
    sustain: chance.floating({min: 0.05, max: 1.5}),
    // release: 1.71
    release: chance.floating({min: 0.05, max: 1})
  },
  "oscillator": {
    // type: 'sine'
    type: chance.pick(['sine', 'triangle'])
  }
})

monoSynth.volume.value = chance.floating({min: -18, max: -2})

const monoSynth2 = new Tone.MonoSynth().toMaster();
monoSynth2.set({
  "envelope": {
    attack: chance.floating({min: 0, max: 1}),
    decay: chance.floating({min: 0.05, max: 1}),
    sustain: chance.floating({min: 0.05, max: 1}),
    // release: 1.71
    release: chance.floating({min: 1, max: 1})
  },
  "oscillator": {
    // type: 'sine'
    type: chance.pick(['sine', 'triangle'])
  }
})

monoSynth2.volume.value = chance.floating({min: -10, max: -2})

const noiseSynth = new Tone.NoiseSynth().toMaster()
noiseSynth.volume.value = chance.floating({min: -5, max: -1})
noiseSynth.set({
  noise: {
    type: chance.pick(['white', 'brown'])
  },
  envelope: {
    // attack: 0.005,
    attack: chance.floating({min: 0.001, max: 0.1}),
    decay: chance.floating({min: 0.001, max: 0.2}),
    sustain: 0
  }
})


//////////
// Set up our loops
//////////

// Make our loop
// https://tonejs.github.io/docs/r13/Loop
let loopRep = 0
var loop = new Tone.Loop(function(time){
  // This is the sort of "master" loop which is triggered once a measure
  
  loopRep++ // Keep track of which loop we are on
  errors-=learning // Every loop, reduce errors by learning value
  errors = _.clamp(errors, 0, 100) // Clamp errors value to 100
  
  // Change the background color every measure
  $('body').css('background-color', `rgba(${chance.natural({max:255})}, ${chance.natural({max:255})}, ${chance.natural({max:255})})`)
  
  // Depending on the `errors` value, tweak the global BPM a bit faster or slowe
  if( chance.bool({likelihood: errors * 0.1})) {
    tempo-=tempo*0.01 // slower
    Tone.Transport.bpm.value = tempo
  } else if( chance.bool({likelihood: errors * 0.05})) {
    tempo+=tempo*0.02 // faster
    Tone.Transport.bpm.value = tempo
  }
  
  // Pick the number of notes in this loop's chord
  let numChordNotes = chance.integer({min: 2, max: 8})
  
  let notes = makeRandomChord(numChordNotes,[2,5]) // Now make a chord, second argument is octave min and max
  
  // Small chance of setting new values on some of the synths every loop
  if(chance.bool({likelihood: 10})) {
    polySynth.set({
    "envelope": {
      attack: chance.floating({min: 0.1, max: 1}),
      release: chance.floating({min: 0.1, max: 10})
    }})
    monoSynth.volume.value = chance.floating({min: -18, max: -2})
  }
  
  // Super small chance of a key change
  if(chance.bool({likelihood: errors * 0.1})) {
    keyCenter = chance.pick(possibleKeyCenters)
  }
  
  // Pick the length of the chord we are gonna play
  const noteLength = chance.pick(['0.5', '8n', '16n', '4n', '1m'])
  polySynth.triggerAttackRelease(notes, noteLength)  
  
  // Log out the settings
  logConfig()
  
}, "1m").start(0)
loop.iterations = 512;


var loop2 = new Tone.Loop(function(time){
  let note = makeRandomNote()
  
  // Small chance of a new volume for the synth
  if(chance.bool({likelihood: 8})) {
    polySynth2.volume.value = chance.floating({min: -12, max: -2})
  }
	
  // Likelihood of transposing the note in this loop increases with more loops
  if(chance.bool({likelihood: 32 + (loopRep*0.75)})){
    const transposeDistance = chance.pick([3, 5, 7, 12, -12])
    Tone.Frequency(note).transpose(transposeDistance)
  }
  if(chance.bool({likelihood: 20+loopRep})) {
    // Likelihood of triggering a note increases with more loops
    polySynth2.triggerAttackRelease(note, "4n")
  }  
}, "2n").start(0)

loop2.iterations = 128;

var loop3 = new Tone.Loop(function(time){
  let note = ''
  let transposeDistance = chance.pick([-2, 3, 5, 7, 12, -12])
  
  // Decide whether the note is gonna come from the chord
  // of everything else, or just a truly random note
  if(chance.bool({likelihood: 75})) {
   note = currentChord[0] 
  } else {
    note = makeRandomNote([1,6])
  }
  
  // Chance of transposing note which increases with each loop
  if(chance.bool({likelihood: 10+loopRep})){    
    
    // If error-prone, potentially make an error
    if (errors > 50) {
      if (chance.bool()) {
       transposeDistance -= 1  
      }      
      if (chance.bool()) {
       transposeDistance += 2  
      }
    }
    
    // Transpose the note 
    Tone.Frequency(note).transpose(transposeDistance)
  }  
  
  // Pick the length of the note
  const noteLen = chance.pick(['4', '8', '16'])
  
  // Maybe trigger a note (more likely as we go on)
  if(chance.bool({likelihood: 35 + loopRep})) {
    if (chance.bool()) {
     monoSynth.volume.value = chance.floating({min: minVol, max: -2}) 
    }    
   monoSynth.triggerAttackRelease(note, noteLen+'n') 
  }
  
  // Maybe make an error
  if (errors > 50) {
    if (chance.bool()) {
     transposeDistance -= 1  
    }      
    if (chance.bool()) {
     transposeDistance += 2  
    }
  }
  
  
  
  // Maybe trigger a note on monosynth2
  if(chance.bool({likelihood: 20})){
    monoSynth2.volume.value = chance.floating({min: minVol+5, max: -2})
    monoSynth2.triggerAttackRelease(note, noteLen+'n')
  }
  
  // Maybe do some wild jazzy shit
  if(chance.bool({likelihood: 20})){
    const transpose = chance.pick([-12, -3,5,7, 12])
    const subNote = Tone.Frequency(note).transpose(transpose)
    if(chance.bool({likelihood: 20+loopRep})) {
      monoSynth2.triggerAttackRelease(subNote, noteLen+'n')
    }
  }
  
  // Maybe reconfigure the monosynths
  if(chance.bool({likelihood: 20})){
    monoSynth.set({
        "envelope": {
          attack: chance.floating({min: 0, max: 2}),
          decay: chance.floating({min: 0.005, max: 2}),
          sustain: chance.floating({min: 0.005, max: 2}),
          // release: 1.71
          release: chance.floating({min: 0.2, max: 5})
      },
    })
    monoSynth2.set({
        "envelope": {
          attack: chance.floating({min: 0, max: 2}),
          decay: chance.floating({min: 0.005, max: 2}),
          sustain: chance.floating({min: 0.005, max: 2}),
          // release: 1.71
          release: chance.floating({min: 0.2, max: 5})
      },
    })
  }
}, "16n").start(0)

// Fuckin jam, dood
loop3.iterations = 1000;

// I assume you're getting the gist of how this works by now

// Loop 4 is the hihat, aka some noise 
let loop4Speed = 4 // Start off playing every beat
const hihatVolumeScale = d3.scaleLinear().domain([0, 64]).range([-12, -4]) // Increase hi hat volume over the course of repetitions
var loop4 = new Tone.Loop(function(time){
  const maxVol = hihatVolumeScale(loopRep)
  noiseSynth.volume.value = chance.floating({min: maxVol-6, max: maxVol})
  noiseSynth.triggerAttackRelease("8n")
  
  // Maybe re-configure the hi-hat
  if(chance.bool({likelihood: 0.5})){
    noiseSynth.set({
      noise: {
        type: chance.pick(['white', 'brown'])
      },
      envelope: {
        attack: chance.floating({min: 0.001, max: 0.1}),
        decay: chance.floating({min: 0.001, max: 0.2}),
      }
    })
  }
}, loop4Speed+"n").start(0)
loop4.iterations = 1000;


var loop5 = new Tone.Loop(function(time){
  let chord = makeRandomChord()
  if(chance.bool({likelihood: (100-errors) * 0.1})) {
    polySynth3.triggerAttackRelease(chord, "4n")
  }
}, "+1m").start(0)

loop5.iterations = 1024;



//////////
// Handle interactions / start / stop
//////////
// Start everything up on click
$(window).on('click', function () {
  console.log('click')
  if (!window.playing) {
    Tone.Transport.start();
  } else {
    Tone.Transport.stop();
  }
  window.playing = !window.playing
})


