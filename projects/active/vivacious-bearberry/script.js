const TOTAL_DESTINATIONS = 50;

class World {
  constructor() {
    this.pc = new ParticleController(this);
    this.dg = new DestinationGenerator;
    this.eg = new EventGenerator;
    this.esg = new EventSequenceGenerator;
    this.date = new Date(2019, 0, 1);
    this.destinations = [];
  }
  
  start() {
    const total = 400;
    for(let i=0; i<total; i++) {
      this._generateParticle();
    }
    setInterval(
      () => {this.tick()},
      200);
  }
  
  tick() {
    this.date.setDate(this.date.getDate() + 1);
    document.getElementById('date').innerHTML = `${this.date}`;
    //this.pc.update();
  }
  
  _generateParticle() {
    this.events = this.esg.generate(TOTAL_DESTINATIONS);
    if (this.destinations.length === 0) {
      this.destinations = this.dg.generate(this.events.length);
    }
    this.pc.addParticle(0, 0, Math.round(Math.random()*8), getColor(), this.destinations, this.events);
    /*
    setInterval(
      () => {
        let source = Math.floor(Math.random() * this.destinations.length);
        let target = source;
        while (source === target) {
          target = Math.floor(Math.random() * this.destinations.length);
        }
        this.pc.addParticle(0, 0, 5, getColor(), this.destinations[source], this.destinations[target])
      }
      , 3000
    );
    */
  }

}
class Particle {
  constructor(x, y, r, dx, dy, color, destinations, events) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.dx = dx;
    this.dy = dy;
    this.color = color;
    this.origin = origin;
    this.destinations = destinations;
    this.events = events;
    this.location = 0;
    this.status = 1;
  }
  
  update(date) {
    this._checkLocation(date);
    //if (this.status > 0) {
      if (this.location <= this.destinations.length) {
        //let origin = this.destinations[this.location];
        let destinationIndex = this.location;
        let destination = this.destinations[destinationIndex];

        this.dx += this.x < destination.x ? 0.1 : -0.1;
        this.dy += this.y < destination.y ? 0.1 : -0.1;

        this.x += this.dx;
        this.y += this.dy;

        this.dx /= Math.abs(this.x - destination.x) < 25 ? 1.2 : 1;
        this.dy /= Math.abs(this.y - destination.y) < 25 ? 1.2 : 1;

        if (Math.abs(this.x - destination.x) < 5 + (destination.size/10) && Math.abs(this.y - destination.y) < 5 + (destination.size/10)) {
          //this.location = this.location + 1;
          //this.x = this.origin.x;
          //this.y = this.origin.y;
          if (this.location >= this.destinations.length - 1 && Math.random() < 0.01) {
            this.status = 0;
          }
          this.dx = Math.random()*1.5 - 0.75;
          this.dy = Math.random()*1.5 - 0.75;

        }
      }
  }
  
  _checkLocation(date) {
    for(let i=0; i<this.events.length; i++) {
      if (date > this.events[i].created_at) {
        this.location = i;
      }
    }
  }
  
}

class ParticleController {
  constructor(world) {
    this.particles = [];
    this.world = world;
  }

  addParticle(x,y,r,color, destinations, events) {
    var particle = new Particle(x, y, r, Math.random()*4 - 2, Math.random()*4 - 2, color, destinations, events);
    this.particles.push(particle);
  }
  
  update(date) {
    this.world.destinations.forEach(destination => destination.size = 0);
    this.particles.forEach( (particle, index) => { 
      particle.update(date);
      this.world.destinations[particle.location].size += 1;
    } ); 
    for(let i=0; i<this.particles.length; i++) {
      if (this.particles[i].status === 0) {
        this.particles.splice(i, 1);
        i = i - 1;
      }
    }
  }
}

class Destination { 
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = 0;
  }
}

class DestinationGenerator {
  constructor() {
    this.destinations = [];
  }
  
  generate(total) {
    const valuesPerRow = 10;
    const hMargin = 0;
    const vMargin = 50;
    const width = window.innerWidth - hMargin*2;
    const height = window.innerHeight - vMargin*2;
    const hPadding = width / valuesPerRow;
    const vPadding = 100;

    //const valuesPerRow = Math.floor((hMargin*2 + width) / hPadding);

    
    for(let i=0; i<=total; i++) {
      //let x = Math.round( (Math.random() * window.innerWidth/1.2) + 50);
      //let y = Math.round( (Math.random() * window.innerHeight/1.2) + 50);
      if (i == 13 || i == 0) {
        //debugger;
      }
      let x = (i % valuesPerRow) * hPadding + hMargin*2;
      let y = Math.floor(i / valuesPerRow) * vPadding + vMargin*2;
      if (Math.floor(i / valuesPerRow) % 2 != 0) {
        x = (width - x) - hPadding;
      }
      console.log(x,y, Math.ceil(hMargin + (hPadding * i) / width)%2);
      this.destinations.push(new Destination(x, y));
    }
    return this.destinations;
  }
  
}

class Event {
  constructor(id, description, key, created_at) {
    this.id = id;
    this.description = description;
    this.key = key;
    this.created_at = created_at;
  }
}

class EventGenerator {
  constructor() {
    this.events = [];
    this.eventTypes = ['first', 'second', 'third', 'fourth'];
  }
  
  generate(total) {
    this.events = [];
    for(let i=0; i<total; i++) {
      this.events.push(this._generateEvent(i));
    }
    return this.events;
  }
  
  _generateEvent(id) {
    let event = new Event(id, "test", "value", Date.now());
    return event;
  }
}

class EventSequence {
  constructor(events) {
    this.events = events;
  }
}

class EventSequenceGenerator {
  constructor() {
    this.events = [];
    this.eg = new EventGenerator;
  }
  
  generate(total) {
    this.events = this.eg.generate(total);
    this.events.forEach( item => item.created_at = randomDate() );
    this.events.sort( (a,b) => a.created_at - b.created_at );
    this.events.forEach( (item, index) => item.key = index);
    return this.events;
  }
}

function getColor() {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
}

function randomDate() {
  const start = new Date(2019,0,1);
  const end = new Date(2019,11,31);
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}


