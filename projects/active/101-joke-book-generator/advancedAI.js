const TOTAL_JOKES = 101;

var nouns = [ 
  'cat', 'chair', 'hat', 'volcano', 'snow', 'toilet', 'newspaper', 'beer', 'toenail',
  'naked molerat', 'mustache', 'earwax', 'sloth', 'underpants', 'nipple', 'eyeball',
  'wart', 'slinky', 'dentures', 'texas baby', 'body lotion', 'hotdog', 'taco',
  'toilet seat', 'toilet paper', 'selfie', 'snowman', 'wife', 'husband', 'snake',
  'sunglasses'
];  
var verbs = [ 
  'hit', 'kiss', 'slurp', 'eat', 'tickle', 'sneeze', 'shave', 'arm wrestle',
  'body slam', 'massage', 'hug', 'slap', 'pinch', 'wiggle', 'drive', 'run over'
];  
var adjectives = [ 
  'cute', 'ugly', 'hungry', 'naked', 'stinky', 'slimy', 'happy', 'tired', 'sloppy',
  'dirty'
];  
var conditions = [ 
  'an appetite', 'diarrhea', 'spots', 'NUMBER NOUNs', 'ADJECTIVE NOUNs'
];  

var numbers = [ 
  '1', '2', '3', '4', '5', Math.floor(Math.random()*100)
]   

var jokes = [ 
  'Why did the NOUN VERB the NOUN? To get to the other NOUN!',
  "What's a NOUN's favorite NOUN? The NOUN-NOUN!",
  'What do you call a NOUN with CONDITION? A ADJECTIVE-NOUN!',
  'What did the NOUN say to the NOUN? "Do you have any ADJECTIVE VERBs?"',
  'How many NOUNs does it take to VERB a NOUN? NUMBER to VERB it and NUMBER to VERB the NOUN!',
  "What do NOUNs and NOUNs have in common? They both VERB ADJECTIVE NOUNs!"
];  

function getRandomItem(list) {
  return list[Math.floor(Math.random()*list.length)];
}   

function generateJoke(joke) {
  joke = replaceAll(joke, "CONDITION", conditions);
  joke = replaceAll(joke, "NUMBER", numbers);
  joke = replaceAll(joke, "VERB", verbs);
  joke = replaceAll(joke, "ADJECTIVE", adjectives);
  joke = replaceAll(joke, "NOUN", nouns);
  return joke;
}   

function replaceAll(str, match, list) {
  while (str.match(match) !== null) {
    str = str.replace(match, getRandomItem(list));
  }   
  return str;
}   

function addJoke() {
  var joke = getRandomItem(jokes);
  var completeJoke = generateJoke(getRandomItem(jokes));
  var ol = document.getElementById("jokes");
  var li = document.createElement('li');
  li.innerText = completeJoke;
  ol.appendChild(li);
}   

function init() {
  for (var i=0; i<TOTAL_JOKES; i++) {
    addJoke();
  }   
}   