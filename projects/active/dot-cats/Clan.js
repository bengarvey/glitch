/* globals

Cat

*/

var Clan = function() {
  
  this.titleCheck = function(cats, clans) {
    var status = {
      leader: false,
      medicine: false,
      deputy: false
    };
    
    var titles = [];
    
    clans.forEach( function(c) {
      titles[c.id] = {};
      titles[c.id].status = status;
    });
    
    cats.forEach( function(c) {
      if (c.title === 'leader' && c.alive) {
        titles[c.clan.id].status.leader = true; 
      }
      if (c.title === 'medicine' && c.alive) {
        titles[c.clan.id].status.medicine = true;
      }
      if (c.title === 'deputy' && c.alive) {
        titles[c.clan.id].status.deputy = true; 
      }
    });
    for(var i=0; i<Object.keys(titles).length; i++) {
      var t = titles[i];
      var clanId = i+0;
      if (!t.status.leader) {
        this.assignLeader(cats, clanId);
      }
      if (!t.status.medicine) {
        this.assignMedicine(cats, clanId);
      }
      if (!t.status.deputy) {
        this.assignDeputy(cats, clanId);
      } 
    }
  }
  
  this.assignLeader = function(cats, clanId) {
    for(var i=0; i<cats.length; i++) {
      if (cats[i].title === 'deputy' && cats[i].alive && cats[i].clan.id === clanId) {
        cats[i].title = 'leader';
        i = cats.length;
      }
    }
  }
  
  this.assignDeputy = function(cats, clanId) {
    for(var i=0; i<cats.length; i++) {
      if (canBeDeputy(cats[i], clanId)) {
        cats[i].title = 'deputy';
        i = cats.length;
      }
    }
  }
  
  this.assignMedicine = function(cats, clanId) {
    for(var i=0; i<cats.length; i++) {
      if (canBeMedicine(cats[i], clanId)) {
        cats[i].title = 'medicine';
        i = cats.length;
      }
    }    
  }
  
  function canBeDeputy(cat, clanId) {
    return cat.title !== 'medicine' && cat.title !== 'leader' && cat.alive && cat.getAgeStatus() === 'warrior' && cat.clan.id === clanId;  
  }
  
  function canBeMedicine(cat, clanId) {
    return cat.title !== 'leader' && cat.title !== 'deputy' && cat.alive && cat.getAgeStatus() === 'warrior' && cat.clan.id === clanId; 
  }
  
  return this;
}