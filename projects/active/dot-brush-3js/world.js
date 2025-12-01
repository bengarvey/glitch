/* globals
  THREE
*/

var World = function(canvasId) {
  
  var camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	var scene = new THREE.Scene();

	var mouse = new THREE.Vector2(), INTERSECTED;
	var camera, scene, raycaster, renderer;
	var radius = 100, theta = 0;

  var WORLD_HEIGHT = window.innerHeight;
  var WORLD_WIDTH = window.innerWidth;
  var WORLD_DEPTH = WORLD_WIDTH/2;
  var gravityX = WORLD_WIDTH / 2;
  var gravityY = WORLD_HEIGHT / 2;
  var gravityZ = WORLD_DEPTH / 2;
  var gravity = 0.05;
  
  scene.position.x = 0;
  scene.position.y = WORLD_HEIGHT;
  scene.position.z = WORLD_DEPTH;
  
  var dx = 5;
  var dy = 5;
  var dz = 5;
  var dwidth = 500;
  var dheight = 500;
  var ddepth = 500;

  // Get the canvas element we need
  var drawing_canvas = document.getElementById(canvasId);
  
  function handleClick(event) {
    gravityX = event.clientX;
    gravityY = event.clientY;
  }



  function Planet(x, y, z, dx, dy, dz, radius, color) {

    var geometry = new THREE.SphereBufferGeometry( radius, radius, radius );
		var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
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


  function move(planet) {
    planet.position.x += planet.velocity.x;
    planet.position.y += planet.velocity.y;
    planet.position.z += planet.velocity.z;

    // gravity check
    planet = _gravityCheck(planet, gravity, gravityX, gravityY, gravityZ);

  }

  function _gravityCheck(planet, gravity, gravityX, gravityY, gravityZ) {
    if (planet.position.x > gravityX) {
      planet.velocity.x -= gravity;
    }
    else {
      planet.velocity.x += gravity;
    }

    if (planet.position.y > gravityY) {
      planet.velocity.y -= gravity;
    }
    else {
      planet.velocity.y += gravity;
    }
    
    if (planet.position.z > gravityZ) {
      planet.velocity.z -= gravity;
    }
    else {
      planet.velocity.z += gravity;
    }

    return planet;
  }

  function _boundaryCheck(planet) {
    if (planet.position.x < 0) {
      planet.velocity.x *= -1;
      planet.position.x = 0;
    }
    else if (planet.x > WORLD_WIDTH) {
      planet.position.x = WORLD_WIDTH;
      planet.velocity.x *= -1;
    }

    if (planet.position.y < 0) {
      planet.position.y = 0;
      planet.velocity.y *= -1;
    }
    else if (planet.position.y > WORLD_HEIGHT) {
      planet.position.y = WORLD_HEIGHT;
      planet.velocity.y *= -1;
    }
  
    if (planet.position.z < 0) {
      planet.position.z = 0;
      planet.velocity.z *= -1;
    }
    else if (planet.position.z > WORLD_DEPTH) {
      planet.position.z = WORLD_DEPTH;
      planet.velocity.z *= -1;
    }

    return planet;
  }

  function init(total) {
    var container = document.createElement( 'div' );
		document.body.appendChild( container );

		camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
		scene = new THREE.Scene();
		scene.background = new THREE.Color( 0xf0f0f0 );
		var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );

    /*
				for ( var i = 0; i < 1500; i ++ ) {
					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );
					object.position.x = Math.random() * 100 - 50;
					object.position.y = Math.random() * 100 - 50;
					object.position.z = Math.random() * 100 - 50;
          object.velocity = {
            x: Math.random() * 6 - 3,
            y: Math.random() * 6 - 3,
            z: Math.random() * 6 - 3,
          }
					//object.rotation.x = Math.random() * 2 * Math.PI;
					//object.rotation.y = Math.random() * 2 * Math.PI;
					//object.rotation.z = Math.random() * 2 * Math.PI;
					//object.scale.x = Math.random() + 0.5;
					//object.scale.y = Math.random() + 0.5;
					//object.scale.z = Math.random() + 0.5;
					scene.add(object);
          items.push(object);
				}
    */

    var planets = [];
    for(var i=0; i<total; i++) {
      var x = Math.floor(Math.random() * WORLD_WIDTH);
      var y = Math.floor(Math.random() * WORLD_HEIGHT);
      var z = Math.floor(Math.random() * WORLD_DEPTH);
      var dx = Math.floor(Math.random() * 20) - 10;
      var dy = Math.floor(Math.random() * 20) - 10;
      var dz = Math.floor(Math.random() * 20) - 10;
      var radius = Math.floor(Math.random() * 40) + 10;
      //var color = '#'+Math.floor(Math.random()*16777215).toString(16);
      var color = getRandomRGBA();
      var planet = new Planet(x, y, z, dx, dy, dz, radius, color);
      planets.push(planet);
      scene.add(planet);
    }
	  raycaster = new THREE.Raycaster();
		renderer = new THREE.WebGLRenderer();
		renderer.setPixelRatio( window.devicePixelRatio );
		renderer.setSize( window.innerWidth, window.innerHeight );
		container.appendChild(renderer.domElement); 
    
    return planets;
  }
  
	function animate() {
	  requestAnimationFrame( animate );
      planets.forEach( (item) => {
      item.position.x += item.velocity.x;
      item.position.y += item.velocity.y;
      item.position.z += item.velocity.z;

      //item = _boundaryCheck(item);
      item = _gravityCheck(item, gravity, gravityX, gravityY, gravityZ);
    });
		render();
	}
  
  function render() {
    //theta += 0.5;
    camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) ) + 2500;
    camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) ) + 2000;
    camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) ) + 2000;
    camera.lookAt( scene.position );
    camera.updateMatrixWorld();
    // find intersections
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
    renderer.render( scene, camera );
  }
  
  function color() {
    return Math.floor(Math.random()*256); 
  }
  
  function getRandomRGBA() {
    return `rgba(${color()},${color()},${color()},1)`;
  }

  var planets = init(500);
  animate();
  //setInterval( update, 10);
}
