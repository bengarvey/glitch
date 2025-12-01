/* globals

  COLOR
  World
  
  randomItem

*/

function Draw(context) {
  this.context = context;
  this.mouseLoc = {x:0,y:0};
  
  document.addEventListener('mousemove', e => {
    this.mouseLoc = {
      x: e.clientX,
      y: e.clientY
    }
  });
  
  function checkHover(e) {
    this.mouseLoc = {
      x: e.clientX,
      y: e.clientY
    };
  }
  
  this.rect = function(startX, startY, width, height, color) {
    this.context.beginPath();
    this.context.rect(startX, startY, width, height, color);
    this.context.fillStyle = color;
    this.context.lineWidth = 1;
    this.context.fill();
  }
  
  this.line = function(startX, startY, endX, endY, color) {
    this.context.beginPath();
    this.context.moveTo(startX, startY);
    this.context.lineTo(endX,endY);
    this.context.strokeStyle = color;
    this.context.lineWidth = 1;
    this.context.stroke();
  }
  
  this.triangle = function(x, y, direction, width, height, color) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(x, y-height);
    this.context.lineTo(x+(width*direction), y);
    this.context.fill(); 
  }
  
  this.perfectTriangle = function(x, y, width, height, color) {
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.moveTo(x, y);
    this.context.lineTo(x-(width/2), y + (height/2));
    this.context.lineTo(x+(width/2), y + (height/2));
    this.context.fill(); 
  }

 this.circle = function(x, y, radius, fillColor, strokeColor) {
    this.context.beginPath();
    this.context.fillStyle = fillColor;
    this.context.strokeStyle = strokeColor;
    this.context.arc(x, y, radius, 50, Math.PI*2, true);
    this.context.lineWidth = 1;
    this.context.closePath();
    this.context.fill();
    this.context.stroke();
  }
 
 this.oval = function(x, y, xSize, ySize, fillColor, strokeColor) {
    var width = xSize;
    var height = ySize;
    this.context.beginPath();
    this.context.strokeColor = strokeColor;
    this.context.fillStyle = fillColor;
    this.context.lineWidth = 2;
    this.context.moveTo(x, y - height/2); // A1
    this.context.bezierCurveTo(
      x + width/2, y - height/2, // C1
      x + width/2, y + height/2, // C2
      x, y + height/2); // A2
    this.context.bezierCurveTo(
      x - width/2, y + height/2, // C3
      x - width/2, y - height/2, // C4
      x, y - height/2); // A1
    this.context.closePath();	
    strokeColor !== null ? this.context.stroke() : null;
    this.context.fill();
    console.log("drawing ovals", xSize, ySize);
 }
 
 this.curve = function(x, y, 
                        width, height, 
                        startOffset, endOffset, 
                        strokeColor, fillColor) {
   this.context.fillStyle = fillColor;
   this.context.beginPath();
   this.context.strokeStyle = strokeColor;
   this.context.moveTo(x - (width / 2), y + startOffset);
   this.context.bezierCurveTo(x - (width / 2), y + height + startOffset,
                              x + (width / 2), y + height + endOffset,
                              x + (width / 2), y + endOffset);
   this.context.lineWidth = 1;
   this.context.stroke(); 
   fillColor !== null ? this.context.fill() : null;
 }
 
  this.text = function(x, y, string, color, size) {
    this.context.font = this.context.font != null ? `${size}px Arial` : "14px Arial";
    this.context.fillStyle = color;
    this.context.fillText(string, x, y);   
  }
  
  this.cat = function(x, y, cat, detailed) {
    detailed ? this._highDetailCat(x, y, cat) : this._lowDetailSpriteCat(x, y, cat);
  }
  
  this.entity = function(x, y, entity, large) {
    if (large) {
      this._lowDetailSpriteEntity(x, y, entity, 4);   
    } else {
      this._lowDetailSpriteEntity(x, y, entity, 1);
    }
  }
  
  this._lowDetailCat = function(x, y, cat) {
    if (cat.getAgeStatus() === 'elder') {
      this.oval(x, y, cat.getRadius()*2, cat.getRadius(), cat.getClanColor(), cat.getColor());
      this.triangle(x-cat.getRadius()+3, y, 1, cat.getRadius()-6, cat.getRadius(), cat.getClanColor());
      this.triangle(x+cat.getRadius()-3, y, -1, cat.getRadius()-6, cat.getRadius(), cat.getClanColor());
    }
    else { 
      this.circle(x, y, cat.getRadius(), cat.getClanColor(), cat.getColor()); 
      this.triangle(x-cat.getRadius(), y, 1, cat.getRadius(), cat.getRadius()*2, cat.getClanColor());
      this.triangle(x+cat.getRadius(), y, -1, cat.getRadius(), cat.getRadius()*2, cat.getClanColor()); 
    } 
  }
  
  this._lowDetailSpriteCat = function(x, y, cat) {
    let CAT_WIDTH = cat.getAgeStatus() === 'kit' ? 1 : 2;
    let CAT_COLORS = [
      null,
      cat.color === COLOR.EYE_BLACK ? COLOR.EYE_GREEN : COLOR.EYE_BLACK,
      cat.getColor(),
      COLOR.NOSE,
      COLOR.WHISKERS,
      cat.getSecondaryColor(),
    ]
    
    if (cat.sprite == null || !cat.alive) {
      cat.sprite = this._catSprite(cat);
    }
    
    let arr = cat.sprite;
    
    /*
    
    let arr = [
      [ 
        [0,0,0,2,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,2,2,0,0,5,5,2,0,0,0,0,0,0,0,0,2,5,0],
        [0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,2,2],
        [4,2,2,1,5,2,2,1,2,2,4,4,0,0,0,0,0,0,0,0,5],
        [0,2,2,1,5,5,2,1,2,2,2,0,0,0,0,0,0,0,0,0,2],
        [4,2,2,2,2,3,2,2,2,2,4,4,5,2,5,2,2,0,0,0,5],
        [0,2,2,5,2,2,2,2,2,2,2,5,5,5,5,2,2,2,0,2,2],
        [0,0,5,5,2,2,2,2,2,2,2,2,5,2,2,2,2,2,2,5,0],
        [0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
        [0,0,0,0,2,2,2,2,2,5,5,2,2,2,2,2,2,0,0,0,0],
        [0,0,0,0,2,2,2,2,5,5,5,5,2,2,2,2,2,0,0,0,0],
        [0,0,0,0,0,2,2,0,0,2,2,2,2,0,0,2,2,0,0,0,0],
        [0,0,0,0,0,5,0,0,0,2,0,0,2,0,0,0,2,0,0,0,0],
        [0,0,0,0,0,5,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0]
      ],
      [
        [0,0,0,2,0,0,0,0,5,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,2,2,0,0,5,5,2,0,0,0,0,0,0,2,5,0,0,0],
        [0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,2,5,0],
        [4,2,2,1,5,2,2,1,2,2,4,4,0,0,0,0,0,0,0,2,0],
        [0,2,2,1,5,5,2,1,2,2,2,0,0,0,0,0,0,0,0,5,0],
        [4,2,2,2,2,3,2,2,2,2,4,4,5,2,5,2,2,0,0,2,0],
        [0,2,2,5,2,2,2,2,2,2,2,5,5,5,5,2,2,2,0,5,0],
        [0,0,5,5,2,2,2,2,2,2,2,2,5,2,2,2,2,2,5,2,0],
        [0,0,0,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
        [0,0,0,0,2,2,2,2,2,5,5,2,2,2,2,2,2,0,0,0,0],
        [0,0,0,0,2,2,2,2,5,5,5,5,2,2,2,2,2,0,0,0,0],
        [0,0,0,0,0,5,2,0,0,2,2,2,2,0,0,2,2,0,0,0,0],
        [0,0,0,0,0,5,0,0,0,2,0,0,2,0,0,0,2,0,0,0,0],
        [0,0,0,0,0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0]
      ]
    ]
    
    */

    if (cat.dx <= 0) {
      for (let i=0; i<arr[cat.frame].length; i++) {
        for (let j=0; j<arr[cat.frame][i].length; j++) {
          if (arr[cat.frame][i][j] != null) {
            this.rect(x + j*CAT_WIDTH, y + i*CAT_WIDTH, CAT_WIDTH, CAT_WIDTH, arr[cat.frame][i][j]);
          }
        }
      }
    }
    else {
      for (let i=0; i<arr[cat.frame].length; i++) {
        for (let j=0; j<arr[cat.frame][i].length; j++) {
          if (arr[cat.frame][i][j] != null) {
            this.rect(x - j*CAT_WIDTH + arr[cat.frame][i].length/2, y + i*CAT_WIDTH, CAT_WIDTH*-1, CAT_WIDTH, arr[cat.frame][i][j]);
          }
        }
      }      
    }
  
  }
  
  this._highDetailCat = function(x, y, cat) {
    const scale = Math.round(cat.radius/4) - 1;
    
    switch(cat.getAgeStatus()) {
      case 'kit':
        this.circle(x, y + 38, cat.getRadius()*scale, cat.getClanColor(), cat.getColor()); 
        this.triangle(x-cat.getRadius()*scale, y + 38, 1, cat.getRadius()*scale, cat.getRadius()*2*scale, cat.getClanColor());
        this.triangle(x+cat.getRadius()*scale, y + 38, -1, cat.getRadius()*scale, cat.getRadius()*2*scale, cat.getClanColor()); 
        this.perfectTriangle(x, y + 44, 4, -12, COLOR.NOSE);
        this._catMouth(x, y + 36, 7, 'happy');
        //this._catWhiskers(x, y + 4, 20);
        this._catBody(x, y + 35, 10, 50, cat.color, cat.color);
        break;
      case 'apprentice':
        this.circle(x, y, cat.getRadius()*scale, cat.getClanColor(), cat.getColor()); 
        this.triangle(x-cat.getRadius()*scale, y, 1, cat.getRadius()*scale, cat.getRadius()*2*scale, cat.getClanColor());
        this.triangle(x+cat.getRadius()*scale, y, -1, cat.getRadius()*scale, cat.getRadius()*2*scale, cat.getClanColor()); 
        this.perfectTriangle(x, y + 10, 12, -12, COLOR.NOSE);
        this._catMouth(x, y - 2, 13, 'happy');
        this._catWhiskers(x, y - 2, 20);
        this._catBody(x, y, 25, 70, cat.color, cat.color);
        break;
      case 'elder':
        this.oval(x, y + 10, cat.getRadius()*scale*2, cat.getRadius()*scale, cat.getClanColor(), cat.getClanColor());
        this.triangle(x-cat.getRadius() - 6, y + 2, 1, (cat.getRadius()*scale) - 6, cat.getRadius() * scale, cat.getClanColor());
        this.triangle(x+cat.getRadius() + 6, y + 2, -1, (cat.getRadius()*scale) - 6, cat.getRadius() * scale, cat.getClanColor());
        this.perfectTriangle(x, y + 16, 6, -12, COLOR.NOSE);
        this._catMouth(x, y + 5, 12, 'happy');
        this._catWhiskers(x, y + 5, 40);
        this._catBody(x, y, 35, 85, cat.color, cat.color);
        break;
      default:
        this.circle(x, y, cat.getRadius()*scale, cat.getClanColor(), cat.getColor()); 
        this.triangle(x-cat.getRadius()*scale, y, 1, cat.getRadius()*scale, cat.getRadius()*2*scale, cat.getClanColor());
        this.triangle(x+cat.getRadius()*scale, y, -1, cat.getRadius()*scale, cat.getRadius()*2*scale, cat.getClanColor()); 
        this.perfectTriangle(x, y + 10, 12, -12, COLOR.NOSE);
        this._catMouth(x, y, 17, 'happy');
        this._catWhiskers(x, y, 40);
        this._catBody(x, y, 35, 85, cat.color, cat.color);
    }
    
    //this._catBody(x, y, 35, 85, cat.color, cat.color);


    this._catEyes(x, y, cat.getAgeStatus(), 'round');


  }
  
  this._catEyes = function(x, y, age, type) {
    if (type === 'round') { 
      this._catEyesRound(x, y, age)
    }
    else if (type === 'closed') {
      this._catEyesClosed(x, y, age);
    }
  }
  
  this._catMouth = function(x, y, width, type) {
    switch(type) {
        case 'happy':
            this._catMouthHappy(x, y, width);
            break;
        case 'sad':
            this._catMouthSad(x, y, width);
            break;
        default:
            this._catMouthHappy(x, y, width);
    }
  }
  
  this._catEyesRound = function(x, y, age) {
    function getOffset(min, max) {
      return Math.round(Math.random() * (max-min)) + min;
    }
    switch(age) {
      case 'kit':
        this.circle(x - 4, y + 36, 1, COLOR.EYE_BLACK, COLOR.EYE_BLACK);
        this.circle(x + 4, y + 36, 1, COLOR.EYE_BLACK, COLOR.EYE_BLACK);  
        break
      case 'apprentice':
        this.circle(x - 8, y - 7, 8, COLOR.EYE_WHITE, COLOR.EYE_OUTLINE);
        this.circle(x + 8, y - 7, 8, COLOR.EYE_WHITE, COLOR.EYE_OUTLINE);
        this.circle(x - 4, y - 7, 3, COLOR.EYE_BLACK, COLOR.EYE_BLACK);
        this.circle(x + 12, y - 7, 3, COLOR.EYE_BLACK, COLOR.EYE_BLACK);  
        break;
      case 'elder':
        this.circle(x - 8, y + 6, 5, COLOR.EYE_WHITE, COLOR.EYE_OUTLINE);
        this.circle(x + 8, y + 6, 5, COLOR.EYE_WHITE, COLOR.EYE_OUTLINE);
        this.circle(x - 4, y + 6, 2, COLOR.EYE_BLACK, COLOR.EYE_BLACK);
        this.circle(x + 12, y + 6, 2, COLOR.EYE_BLACK, COLOR.EYE_BLACK);  
        break;
      default:
        this.circle(x - 12, y - 10, 12, COLOR.EYE_WHITE, COLOR.EYE_OUTLINE);
        this.circle(x + 12, y - 10, 12, COLOR.EYE_WHITE, COLOR.EYE_OUTLINE);
        this.rotateCircleTowardMouse(x - 12, y - 10, 10, COLOR.EYE_BLACK, COLOR.EYE_BLACK, 8);
        this.rotateCircleTowardMouse(x + 12, y - 10, 10, COLOR.EYE_BLACK, COLOR.EYE_BLACK, 8);  
    }
  }
  
  this.rotateCircleTowardMouse = function(x, y, radius, fillColor, strokeColor, offset) {
    let dx = this.mouseLoc.x - x,
        dy = this.mouseLoc.y - y,
 		    rot = Math.atan2(dy, dx);


    this.context.beginPath();
    this.context.fillStyle = fillColor;
    this.context.strokeStyle = strokeColor;

    this.context.arc(x, y, radius, rot + 1.5, rot - 1.5, true);

    this.context.lineWidth = 3;
    this.context.closePath();
        
    this.context.fill();
    
  }
  
  this._catEyesClosed = function(x, y, age) {
    switch(age) {
      case 'kit':
        this.curve(x-6, y + 5, 5, -3, 0, 0, COLOR.MOUTH, null);
        this.curve(x+6, y + 5, 5, -3, 0, 0, COLOR.MOUTH, null);
        break;
      default:
        this.curve(x-12, y-10, 18, -8, 0, 0, COLOR.MOUTH, null);
        this.curve(x+12, y-10, 18, -8, 0, 0, COLOR.MOUTH, null);
    }
  }
  
  this._catMouthHappy = function(x, y, width) {
    this.line(x, y + 10, x, y + width-2, COLOR.MOUTH);
    this.curve(x - (width/2), y + (width)-2, width, width/2, 0, 0, COLOR.MOUTH, null);
    this.curve(x + (width/2), y + (width)-2, width, width/2, 0, 0, COLOR.MOUTH, null);
  }
  
  this._catMouthSad = function(x, y, width) {
    this.line(x, y + 10, x, y + 15, COLOR.MOUTH);
    this.curve(x, y + 20, 30, -8, 0, 0, COLOR.MOUTH);
  }
  
  this._catWhiskers = function(x, y, width) {
    this.curve(x - 25, y + 10, 40, -10, 0, 0, COLOR.MOUTH, null);
    this.curve(x - 25, y + 12, 40, -10, 10, 0, COLOR.MOUTH, null);
    this.curve(x - 25, y + 14, 40, -10, 20, 0, COLOR.MOUTH, null);
    
    this.curve(x + 25, y + 10, 40, -10, 0, 0, COLOR.MOUTH, null);
    this.curve(x + 25, y + 12, 40, -10, 0, 10, COLOR.MOUTH, null);
    this.curve(x + 25, y + 14, 40, -10, 0, 20, COLOR.MOUTH, null);
  }
  
  this._catBody = function(x, y, width, height, color) {
    
    // tail
    this.curve(x + width, y + height, 20, 30, -10, -60, color, color);
    
    // body
    this.curve(x, y + height, width + 20, height * -1, 0, 0, color, color);
    
    // paw
    this.curve(x - (width / 3) - 3, y + height, width / 2, -10, 0, 0, COLOR.PAW, color);
    this.curve(x + (width / 3) + 3, y + height, width / 2, -10, 0, 0, COLOR.PAW, color);
  }
  
  this._catSprite = function(cat) {
    let CAT_COLORS = [
      null,
      cat.color === COLOR.EYE_BLACK ? COLOR.EYE_GREEN : COLOR.EYE_BLACK,
      cat.getColor(),
      COLOR.NOSE,
      COLOR.WHISKERS,
      cat.getSecondaryColor(),
    ]
    let sprite = [
      [
        [0,0,0,2,0,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
        [0,0,2,2,2,0,0,2,2,2,0,0,0,0,0,0,0,0,2,2,0],
        [0,0,2,2,2,2,2,2,2,2,0,0,0,0,0,0,0,0,0,2,2],
        [4,2,2,1,2,2,2,1,2,2,4,4,0,0,0,0,0,0,0,0,2],
        [0,2,2,1,2,2,2,1,2,2,2,0,0,0,0,0,0,0,0,0,2],
        [4,2,2,2,2,3,2,2,2,2,4,4,2,2,2,2,2,0,0,0,2],
        [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,2,2],
        [0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
        [0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
        [0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0],
        [0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,0,0,0,0],
        [0,0,0,0,0,2,2,0,0,2,2,2,2,0,0,2,2,0,0,0,0],
        [0,0,0,0,0,2,0,0,0,2,0,0,2,0,0,0,2,0,0,0,0],
        [0,0,0,0,0,2,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0]
      ]
    ];
    for (let i=0; i<sprite[0].length; i++) {
      for (let j=0; j<sprite[0][i].length; j++) {
        sprite[0][i][j] = sprite[0][i][j] == 2 ? randomItem([cat.getColor(), cat.getColor(), cat.getColor(), cat.getSecondaryColor()]) : CAT_COLORS[sprite[0][i][j]]; 
      }
    }
    sprite.push(sprite[0]);
    return sprite;
  }
  
  this._lowDetailSpriteEntity = function(x, y, entity, scale) {
    let ENTITY_WIDTH = scale;
    let ENTITY_COLORS = [
      null,
      entity.color === COLOR.EYE_BLACK ? COLOR.EYE_GREEN : COLOR.EYE_BLACK,
      entity.getColor(),
      COLOR.NOSE,
      COLOR.WHISKERS,
      entity.getSecondaryColor(),
    ]
    
    if (entity.sprite == null || !entity.alive) {
      entity.sprite = this._entitySprite(entity);
    }
    
    let arr = entity.sprite;
    
    if (entity.dx <= 0) {
      for (let i=0; i<arr[entity.frame].length; i++) {
        for (let j=0; j<arr[entity.frame][i].length; j++) {
          if (arr[entity.frame][i][j] != null) {
            this.rect(x + j*ENTITY_WIDTH, y + i*ENTITY_WIDTH, ENTITY_WIDTH, ENTITY_WIDTH, arr[entity.frame][i][j]);
          }
        }
      }
    }
    else {
      for (let i=0; i<arr[entity.frame].length; i++) {
        for (let j=0; j<arr[entity.frame][i].length; j++) {
          if (arr[entity.frame][i][j] != null) {
            this.rect(x - j*ENTITY_WIDTH + arr[entity.frame][i].length/2, y + i*ENTITY_WIDTH, ENTITY_WIDTH*-1, ENTITY_WIDTH, arr[entity.frame][i][j]);
          }
        }
      }      
    }
  
  }
  
  this._entitySprite = function(entity) {
  
    let ENTITY_COLORS = [
      null,
      entity.color === COLOR.EYE_BLACK ? COLOR.EYE_GREEN : COLOR.EYE_BLACK,
      entity.getColor(),
      COLOR.NOSE,
      COLOR.WHISKERS,
      entity.getSecondaryColor(),
    ]
    let sprite = this._defaultSprite();
    switch(entity.name) {
      case 'mouse':
        sprite = this._mouseSprite();
        break;
      case 'frog':
        sprite = this._frogSprite();
        debugger;
        break;
    }

    for (let i=0; i<sprite[0].length; i++) {
      for (let j=0; j<sprite[0][i].length; j++) {
        sprite[0][i][j] = sprite[0][i][j] == 2 ? randomItem([entity.getColor(), entity.getColor(), entity.getColor(), entity.getSecondaryColor()]) : ENTITY_COLORS[sprite[0][i][j]]; 
      }
    }
    sprite.push(sprite[0]);
    return sprite;
  }
  
  this._defaultSprite = function() {
    return [
      [
        [0,0,0,2,2,0,0,0],
        [0,0,2,2,2,2,0,0],
        [0,2,2,2,2,2,2,0],
        [2,2,2,2,2,2,2,2],
        [2,2,2,2,2,2,2,2],
        [0,2,2,2,2,2,2,0],
        [0,0,2,2,2,2,0,0],
        [0,0,0,2,2,0,0,0]
      ]
    ];
  }
  
  this._mouseSprite = function() {
    return [
      [
        [2,2,2,0,0,0,2,2,2,0,0,0,0,2,0,0],
        [2,2,2,0,0,0,2,2,2,0,0,0,0,0,2,0],
        [2,2,2,2,2,2,2,2,2,0,0,0,0,0,2,0],
        [0,0,2,1,2,2,1,2,0,0,0,0,0,0,2,0],
        [0,0,2,2,2,2,2,2,2,2,2,2,0,2,2,0],
        [0,0,2,2,2,2,2,2,2,2,2,2,2,2,0,0],
        [0,0,0,2,2,2,2,2,2,2,2,2,2,0,0,0],
        [0,0,0,0,2,2,2,2,2,2,2,2,2,0,0,0],
        [0,0,0,0,2,2,2,2,2,2,2,0,2,0,0,0],
        [0,0,0,0,2,0,0,2,0,0,0,0,2,0,0,0]
      ]
    ];
  }
  
  this._frogSprite = function() {
    return [
      [
        [0,0,0,2,2,0,0,0,2,2,2,0,0,0,0,0],
        [0,0,2,2,2,2,0,2,2,2,2,0,0,0,0,0],
        [0,0,2,1,1,2,2,2,1,1,2,0,0,0,0,0],
        [0,2,2,2,2,5,5,5,2,2,2,2,0,0,0,0],
        [2,2,5,5,5,5,5,5,5,2,2,2,0,0,0,0],
        [5,5,5,5,5,5,5,5,5,5,2,2,2,2,0,0],
        [5,5,5,5,5,5,5,5,5,5,5,2,2,2,0,0],
        [5,5,5,5,5,5,5,5,5,5,5,2,2,2,0,0],
        [0,5,5,5,5,5,5,5,0,0,2,2,2,2,0,0],
        [0,0,2,2,0,2,2,0,0,0,0,2,2,2,2,2],
        [0,0,0,2,0,0,2,0,0,0,0,0,0,0,2,2]
      ]
    ];
  }
  
}