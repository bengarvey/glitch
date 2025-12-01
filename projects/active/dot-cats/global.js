// General helper functions

function getOffset(max) {
  var offset = (Math.random() * (2*max)) - max;
  return Math.round(offset); 
}

// object needs to have an x, y, and radius
// the full parameter is a hack to make sure the cat
// is fully inside the territory when it drops off a kill
function isColliding(a, b, full=false) {
  return _collision(a.x, a.y, a.radius, b.x, b.y, full ? b.radius/2 : b.radius);
  function _collision(p1x, p1y, r1, p2x, p2y, r2) {
    var a;
    var x;
    var y;

    a = r1 + r2;
    x = p1x - p2x;
    y = p1y - p2y;
    return a > Math.sqrt( (x*x) + (y*y) );
  }

}

function randomInt(min, max) {
  return Math.floor((Math.random() * (max-min)) + min);
}

function randomItem(list) {
   return list[Math.floor(Math.random() * list.length)]; 
}

var COLOR = {
  GRASS: '#bf9963',
  BLANK: '#ffffff',
  WATER: '#ddddff',
  PLANT: '#77ee77',
  TEXT: 'rgba(0,0,0,1)',
  EYE_WHITE: '#ffffff',
  EYE_OUTLINE: '#000000',
  EYE_BLACK: '#000000',
  EYE_GREEN: '#144B0B',
  NOSE: '#ff6666',
  MOUTH: '#000000',
  PAW: '#000000',
  TRANSPARENT: 'rgba(0,0,0,0)',
  GRID: 'rgba(0,0,0,0.2)',
  SUCCESS: 'rgb(76,169,84,0.5)',
  WHISKERS: '#000000'
}

var CAT_COLORS = [
  '#333333',
  '#e69832'
]


function randomColor() {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

// https://stackoverflow.com/questions/6367010/average-2-hex-colors-together-in-javascript
function avgHex(h1,h2){var a=hexToRgb(h1);var b=hexToRgb(h2); return rgbToHex(((a[0]+b[0])/2),~~((a[1]+b[1])/2),~~((a[2]+b[2])/2));}
function hexToRgb(h){return['0x'+h[1]+h[2]|0,'0x'+h[3]+h[4]|0,'0x'+h[5]+h[6]|0]}
function rgbToHex(r,g,b){return"#"+((1<<24)+(r<<16)+(g<<8)+ b).toString(16).slice(1);}