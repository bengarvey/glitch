/* globals
  THREE
  Gravity
*/

const DECAY = 0.9;

var World = function(canvasId) {
  
  var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
	var scene = new THREE.Scene();
  var controls = new THREE.PointerLockControls( camera );
  
  var pitchObject = new THREE.Object3D();
  var yawObject = new THREE.Object3D();
  
	const PI_2 = Math.PI / 2;

	var mouse = new THREE.Vector2(), INTERSECTED;
	var cene, raycaster, renderer;
	var radius = 100, theta = 0;

  var WORLD_HEIGHT = 4000;
  var WORLD_WIDTH = 4000;
  var WORLD_DEPTH = WORLD_WIDTH;
  var gravityX = WORLD_WIDTH / 2;
  var gravityY = WORLD_HEIGHT / 2;
  var gravityZ = WORLD_DEPTH / 2;
  var gravity = 9.5;
  
  scene.position.x = 0;
  scene.position.y = 0;
  scene.position.z = 0;
  
  var dx = 5;
  var dy = 5;
  var dz = 5;
  var dwidth = 500;
  var dheight = 500;
  var ddepth = 500;
  
  var grav = new Gravity(gravity);

  // Get the canvas element we need
  var drawing_canvas = document.getElementById(canvasId);
  
  function handleClick(event) {
    grav.g *= -1;
  }
  
  function handleTouch(event) {
    if (event.touches.length < 2) {
      handleClick(event); 
    }
    else {
      if (event.touches.length === 2) {
        console.log(event); 
      }
    }
  }

  function Planet(x, y, z, dx, dy, dz, radius, color) {

    var geometry = new THREE.SphereBufferGeometry( radius, radius, radius );
		//var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
    var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: color} ) );
		object.position.x = x;
		object.position.y = y;
		object.position.z = z;
    object.velocity = {
      x: dx,
      y: dy,
      z: dz,
    } 
    
    return object;
    
  }




  function _gravityCheck(planet, gravity, gravityX, gravityY, gravityZ) {
    planet.velocity.y -= 1;
    
   

    return planet;
  }

  function _boundaryCheck(planet) {
    if (planet.position.x < 0 - WORLD_WIDTH) {
      planet.velocity.x *= -1;
      planet.position.x = 0 - WORLD_WIDTH;
      planet.velocity.x *= DECAY;
    }
    else if (planet.position.x > WORLD_WIDTH) {
      planet.position.x = WORLD_WIDTH;
      planet.velocity.x *= -1;
      planet.velocity.x *= DECAY;
    }

    if (planet.position.y < 0 - WORLD_HEIGHT) {
      planet.position.y = 0 - WORLD_HEIGHT;
      planet.velocity.y *= -1;
      planet.velocity.y *= DECAY; 
    }
    else if (planet.position.y > WORLD_HEIGHT) {
      planet.position.y = WORLD_HEIGHT;
      planet.velocity.y *= -1;
      planet.velocity.y *= DECAY; 
    }
  
    if (planet.position.z < 0 - WORLD_DEPTH) {
      planet.position.z = 0 - WORLD_DEPTH;
      planet.velocity.z *= -1;
      planet.velocity.z *= DECAY;
    }
    else if (planet.position.z > WORLD_DEPTH) {
      planet.position.z = WORLD_DEPTH;
      planet.velocity.z *= -1;
      planet.velocity.z *= DECAY;
    }

    return planet;
  }

  function init(total) {
    var container = document.createElement( 'div' );
		document.body.appendChild( container );

		
    
		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0x000000 );
    
		var light = new THREE.DirectionalLight( 0xffffff, 1 );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );
    
    scene.add(controls.getObject());

    var planets = [];
    for(var i=0; i<total; i++) {
      var x = Math.floor(Math.random() * WORLD_WIDTH) - (WORLD_WIDTH/2);
      var y = Math.floor(Math.random() * WORLD_HEIGHT)  - (WORLD_HEIGHT/2);
      var z = Math.floor(Math.random() * WORLD_DEPTH) - (WORLD_DEPTH/2);
      var dx = Math.floor(Math.random() * 20) - 10;
      var dy = Math.floor(Math.random() * 20) - 10;
      //var dz = Math.floor(Math.random() * 20) - 10;
      var dz = 0;      
      var dx = 0;
      var dy = 0;
      var radius = Math.floor(Math.random() * 30) + 10;
      var radius = 40;
      var color = getRandomRGBA();
      var planet = new Planet(x, y, z, dx, dy, dz, radius, color);
      planets.push(planet);
      scene.add(planet);
    }
    //scene.add(cameraFocus);
	  raycaster = new THREE.Raycaster();
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild(renderer.domElement); 
    
    return planets;
  }
  
	function animate() {
	  requestAnimationFrame( animate );
      planets = grav.apply(planets);
      planets.forEach( (item) => {
      item.position.x += item.velocity.x;
      item.position.y += item.velocity.y;
      item.position.z += item.velocity.z;    

      item = _boundaryCheck(item);
      //item = _gravityCheck(item, gravity, gravityX, gravityY, gravityZ);
      //item = _collisionCheck(item, planets);
    });
		render();
	}
  
  function render() {
    //theta += 0.5;
    camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) ) + 0;
    camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) ) + 0;
    camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) ) + 4000;
    //camera.lookAt( cameraFocus.position );
    camera.updateMatrixWorld();
    // find intersections
    /*
    raycaster.setFromCamera( mouse, camera );
    var intersects = raycaster.intersectObjects( scene.children );
    if ( intersects.length > 0 ) {
      if ( INTERSECTED != intersects[ 0 ].object ) {
        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex( 0xff0000 );
      }
    } else {
      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      INTERSECTED = null;
    }
    */
    renderer.render( scene, camera );
  }
  
  function color() {
    return Math.floor(Math.random()*256); 
  }
  
  function getRandomRGBA() {
    return `rgba(${color()},${color()},${color()},1)`;
  }
  
  function _collisionCheck(planet, items) {
    items.forEach( (item) => {
      if (planet !== item && isColliding(planet, item)) {
        var swap = _velocitySwap(planet, item);
        planet = swap[0];
        item = item[1];
      }
    });
    return planet;
  }
          
  function _velocitySwap(first, second) {
    var temp = first.velocity;
    first.velocity = second.velocity;
    second.velocity = temp;
    return [first, second];
  }
  
  function isColliding(a, b) {
    return _collision(a.position.x, a.position.y, a.position.z, a.geometry.parameters.radius, b.position.x, b.position.y, b.position.z, b.geometry.parameters.radius);
    function _collision(p1x, p1y, p1z, r1, p2x, p2y, p2z, r2) {
      var a;
      var x;
      var y;
      var z;

      a = (r1 + r2) + 10;
      x = p1x - p2x;
      y = p1y - p2y;
      z = p1z - p2z;
      return a > Math.sqrt( (x*x) + (y*y) + (z*z));
    }
  }

  document.addEventListener("click", handleClick);
  document.addEventListener("touchstart", handleTouch);
  
  var planets = init(300);
  var cameraFocus = new Planet(0, 0, 0, 0, 0, 0, 1000, 'rgba(250,250,250,1)');
  
  var prevCamera = {
    x: cameraFocus.position.x,
    y: cameraFocus.position.y
  };
  animate();
  //setInterval( update, 10);
  

}
