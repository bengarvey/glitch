/* global Tone Tonal */

/*
This is your site JavaScript code - you can add interactivity and carry out processing
- Initially the JS writes a message to the console, and moves a button you can add from the README
*/

// Print a message in the browser's dev tools console each time the page loads
// Use your menus or right-click / control-click and choose "Inspect" > "Console"
console.log("Hello 🌎");

/* 
Make the "Click me!" button move when the visitor clicks it:
- First add the button to the page by following the "Next steps" in the README
*/
const btn = document.querySelector("button"); // Get the button from the page
// Detect clicks on the button
if (btn) {
  btn.onclick = function() {
    // The JS works in conjunction with the 'dipped' code in style.css
    btn.classList.toggle("dipped");
  };
}

// This is a single line JS comment
/*
This is a comment that can span multiple lines 
- use comments to make your own notes!
*/

function start() {
  var synth = new Tone.Synth().toMaster();
  const now = Tone.now();

      // create two monophonic synths
    const synthA = new Tone.FMSynth().toMaster();
    const synthB = new Tone.AMSynth().toMaster();
    //play a note every quarter-note
    const loopA = new Tone.Loop(time => {
      synthA.triggerAttackRelease("D1", "16n.", time);
    }, "4n").start(0);
    //play another note every off quarter-note, by starting it "8n"
    const loopB = new Tone.Loop(time => {
      synthB.triggerAttackRelease("C1", "16n.", time);
    }, "4n").start("8n");
    // all loops start until the Transport is started
    Tone.Transport.start()
  
}
