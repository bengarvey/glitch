

/* globals

getOffset
Entity
Dna
randomItem

*/

const HAPPY = '#eeee00';
const SAD = '#333333';

const leaderImage = "https://cdn.glitch.com/f62d4ec3-15d8-447d-95ed-a7524b560084%2Fleader.png?1523142624314"; 
const medicineImage = "https://cdn.glitch.com/f62d4ec3-15d8-447d-95ed-a7524b560084%2Fmedicine.png?1523142550594";
const deputyImage = "https://cdn.glitch.com/f62d4ec3-15d8-447d-95ed-a7524b560084%2Fdeptuty.png?1523142556750";

function Cat(x, y, dx, dy, radius, color, name, title, age, clan, type, gender, dna) {
  Entity.call(this, x, y, dx, dy, radius, color, name, title, age, clan, 'cat', gender, dna);
  
  this.home = [0,0];
  this.alive = true;
  this.home = [clan.x, clan.y];
  this.hunger = 500;
  this.dna = dna;

  
  this.setHome = function(x, y) {
    this.home = [x,y]; 
  }
  
  this.update = function(grid) {
    
    if (this.alive) {
      this.updateAlive(grid);
      this.animate();
      this.alive = !deathCheck(this.getAgeStatus(), this.hunger);
      this.holding.forEach( (ent) => { ent.x = this.x; ent.y = this.y });
    }
    else {
      this.decay += 1; 
    }
  }

  this.getAge = function() {
    return (this.age / 100).toFixed(0);
  }
  
  this.getAgeStatus = function() {
    var age = this.getAge();
    
    if (age < 10) {
      return 'kit';
    }
    else if (age >= 10 && age < 15) {
      return 'apprentice';
    }
    else if (age >= 20 && age < 30) {
      return 'warrior'; 
    }
    else if (age > 30) {
      return 'elder'; 
    }
    else {
      return 'warrior'; 
    }
  }
  
  this.getName = function() {
    var last = getLastName(this.name[1], this.title, this.getAgeStatus());
    return `${this.name[0]}${last}`;
  }

  this.move = function() {
    if (Math.random() > 0.1) {
      this.x += this.dx;
      this.y += this.dy;
    }
  }
  
  this.getClanColor = function() {
    return this.alive ? this.color : "#bbbbbb"; 
  }
  
  this.getColor = function() {
    if (!this.alive) {
      return '#cccccc'; 
    }
    else {
      if (this.dna.dilute.includes(false)) {
        return this.color;
      }
      else {
        return ColorLuminance(this.color, 0.6);
      }
    }
  }
  
  this.getSecondaryColor = function() {
     if (!this.alive) {
      return '#cccccc'; 
    }
    else {
      if (this.gender == 'male') {
        return this.getColor();
      }
      else {
        if (this.dna.dilute.includes(false)) {
          return this.dna.color[1];
        }
        else {
          return ColorLuminance(this.dna.color[1], 0.6);
        }
      }
    }   
  }
  
  this.getRadius = function() {
    var age = this.getAgeStatus();
    if (age === 'kit') {
      return 5;
    }
    else if (age === 'apprentice') {
      return 10;
    }
    else if (age === 'warrior') {
      return 15; 
    }
    else if (age === 'elder') {
      return 15; 
    }
    else {
      return 5; 
    }
  }
  
  this.getIcon = function() {
    if (this.title === 'leader') {
      return leaderImage; 
    }
    else if (this.title === 'medicine') {
      return medicineImage;
    }
    else if (this.title === 'deputy') {
      return deputyImage; 
    }
    else {
      return '';
    }
  }
  
  this.updateAlive = function(grid) {
    // Randomly make the cats change their direction
    if (Math.random() > getChangePercent(this.getAgeStatus())) {
      this.dx = getOffset(getMaxSpeed(this.getAgeStatus()));
      this.dy = getOffset(getMaxSpeed(this.getAgeStatus()));
      
      this.dx = this.dx === 0 ? 1 : this.dx;
      this.dy = this.dy === 0 ? 1 : this.dy;
    }
    
    // We're unhappy or have prey, head for home
    if ((this.state < 0 || this.holding.length > 0) && Math.random() > 0.5) {
      this.dx *= this.x > this.home[0] && this.dx > 0 ? -1 : 1;
      this.dx *= this.x < this.home[0] && this.dx < 1 ? -1 : 1;
      this.dy *= this.y > this.home[1] && this.dy > 0 ? -1 : 1;
      this.dy *= this.y < this.home[1] && this.dy < 1 ? -1 : 1;
    }
    
    this.state += this.state > 0 ? -1 : 0;
    this.hunger += -1;
    this.state = getMaxState(this.state, this.getAgeStatus(), this.title);
    this.age += 1;

    if (this.canMove(grid)) {
      this.move();    
    }
  }
  
  function deathCheck(ageStatus, hunger) {
    if (ageStatus === 'elder' && Math.random() > 0.999) {
      return true; 
    }
    else if (hunger < -100) {
       return true; 
    }
    else {
      return false; 
    }
  }
  
  function getMaxState(state, age, title) {
    if (title === 'medicine' && state > 0) {
      return 0;
    }
    else if (age === 'kit' && state > 5) {
      return 5;
    }
    else if (age === 'apprentice' && state > 500) {
      return 500;
    }
    else if (age === 'warrior' && state > 2000) {
      return 2000; 
    }
    else if (age === 'elder' && state > 10) {
      return 10; 
    }
    else {
      return state; 
    }
  }
  
  function getChangePercent(age) {
    if (age === 'kit') {
      return 0.9;
    }
    else {
      return 0.999;    
    }
  }
  
  function getMaxSpeed(age) {
    if (age === 'kit') {
      return 3; 
    }
    else if (age === 'elder') {
      return 1; 
    }
    else {
      return 2; 
    }
  }
  
  function getLastName(name, title, age) {
    if (title === 'leader') {
      return 'star';
    }
    else if (age === 'kit') {
      return 'kit';
    }
    else if (age === 'apprentice') {
      return 'paw'; 
    }
    else {
      return name; 
    }
    
  }
  
  function ColorLuminance(hex, lum) {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }

    return rgb;
  }
}