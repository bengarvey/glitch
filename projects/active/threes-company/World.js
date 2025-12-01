/* globals
  THREE
  
*/
function World() {
      // copy pasted from https://github.com/mrdoob/three.js/blob/master/examples/webgl_interactive_cubes.html
			var container, stats;
			var camera, scene, raycaster, renderer;
			var mouse = new THREE.Vector2(), INTERSECTED;
			var radius = 100, theta = 0;
      var items = [];
			init();
			animate();
  
			function init() {
				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xf0f0f0 );
				var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
				light.position.set( 1, 1, 1 ).normalize();
				scene.add( light );
				///var geometry = new THREE.BoxBufferGeometry( 5, 5, 5 );
        var geometry = new THREE.SphereBufferGeometry( 8, 8, 8 );
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
				raycaster = new THREE.Raycaster();
				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				container.appendChild(renderer.domElement);

				//document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				//
				//window.addEventListener( 'resize', onWindowResize, false );
			}
  
      
			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
			}
			function onDocumentMouseMove( event ) {
				event.preventDefault();
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			}
      
			//
			function animate() {
				requestAnimationFrame( animate );
        items.forEach( (item) => {
          item.position.x += item.velocity.x;
          item.position.y += item.velocity.y;
          item.position.z += item.velocity.z;

          boundaryCheck(item);
        });
				render();
			}
  
      function boundaryCheck(item) {
        item.velocity.x *= item.position.x > 200 || item.position.x < -200 ? -1 : 1;
        item.velocity.y *= item.position.y > 200 || item.position.y < -200 ? -1 : 1;
        item.velocity.z *= item.position.z > 200 || item.position.z < -200 ? -1 : 1;
      }
  
			function render() {
				//theta += 0.5;
				camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) ) + 300;
				camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) ) + 400;
				camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) ) + 300;
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
}