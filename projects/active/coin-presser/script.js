const WORLD_WIDTH = window.innerWidth;
const WORLD_HEIGHT = window.innerHeight;
const MIN_HEIGHT = 200;
const COIN_WIDTH = 67;
const COIN_HEIGHT = 51;

var totalCoins = 0;

function init() {
  moveCoin();
}

function moveCoin() {
  var coin = document.getElementById('coin');
  coin.style.top = getRandomPx(WORLD_HEIGHT - COIN_HEIGHT, MIN_HEIGHT);
  coin.style.left = getRandomPx(WORLD_WIDTH - COIN_WIDTH, 0);
}

function getRandomPx(maxValue, minValue) {
  return Math.round(Math.random() * (maxValue - minValue) + minValue) + "px";
}

function getCoins() {
  return totalCoins;
}

function addCoin() {
  totalCoins += 1;
  document.getElementById("totalCoins").innerHTML = `coins: ${totalCoins}`;
  moveCoin();
}0