/* globals

mat4

*/

var World = function(canvasId) {

  var WORLD_HEIGHT = window.innerHeight;
  var WORLD_WIDTH = window.innerWidth;
  var WORLD_DEPTH = WORLD_WIDTH;
  var gravityX = WORLD_WIDTH / 2;
  var gravityY = WORLD_HEIGHT / 2;
  var gravityZ = WORLD_DEPTH / 2;
  var gravity = 0.05;
  
  var dx = 5;
  var dy = 5;
  var dz = 5;
  var dwidth = 500;
  var dheight = 500;
  var ddepth = 500;

  // Get the canvas element we need
  var drawingCanvas = document.getElementById(canvasId);
  
  function handleClick(event) {
    gravityX = event.clientX;
    gravityY = event.clientY;
  }

  // A lot of this code is borrowed from https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample2/webgl-demo.js
  // Initaliase a 2-dimensional drawing context
  const gl = drawingCanvas.getContext('webgl');
  const context = gl;

  // If we don't have a GL context, give up now

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Vertex shader program

  const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;

  // Fragment shader program

  const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // Here's where we call the routine that builds all the
  // objects we'll be drawing.
  const buffers = initBuffers(gl);

  // Draw the scene
  drawScene(gl, programInfo, buffers);
  
  //
  // initBuffers
  //
  // Initialize the buffers we'll need. For this demo, we just
  // have one object -- a simple two-dimensional square.
  //
  function initBuffers(gl) {

    // Create a buffer for the square's positions.

    const positionBuffer = gl.createBuffer();

    // Select the positionBuffer as the one to apply buffer
    // operations to from here out.

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Now create an array of positions for the square.

    const positions = [
       1.0,  1.0,
      -1.0,  1.0,
       1.0, -1.0,
      -1.0, -1.0,
    ];

    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.

    gl.bufferData(gl.ARRAY_BUFFER,
                  new Float32Array(positions),
                  gl.STATIC_DRAW);

    return {
      position: positionBuffer,
    };
  }

  //
  // Draw the scene.
  //
  function drawScene(gl, programInfo, buffers) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();

    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
                     fieldOfView,
                     aspect,
                     zNear,
                     zFar);

    // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
                   modelViewMatrix,     // matrix to translate
                   [-0.0, 0.0, -6.0]);  // amount to translate

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.vertexPosition);
    }

    // Tell WebGL to use our program when drawing

    gl.useProgram(programInfo.program);

    // Set the shader uniforms

    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);

    {
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }
  }

  //
  // Initialize a shader program, so WebGL knows how to draw our data
  //
  function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // If creating the shader program failed, alert

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  //
  // creates a shader of the given type, uploads the source and
  // compiles it.
  //
  function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    // Send the source to the shader object

    gl.shaderSource(shader, source);

    // Compile the shader program

    gl.compileShader(shader);

    // See if it compiled successfully

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  

  function drawCircle(x, y, radius, color) {
    context.beginPath();
    context.fillStyle = color;
    context.arc(x, y, radius, 0, Math.PI*2, true);
    context.closePath();
    context.lineWidth = 0;
    context.fill();
  }

  function drawLine(startX, startY, endX, endY, color) {
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX,endY);
    context.strokeStyle = color;
    context.lineWidth = 1;
    context.stroke();
  }

  function Planet(x, y, z, dx, dy, dz, radius, color) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
    this.radius = radius;
    this.color = color;
  }

  function draw(planet, index, planets) {

    var zScale = ( (WORLD_DEPTH - planet.z) / WORLD_DEPTH );
    zScale = zScale < 0 ? 0 : zScale;
    var radius = planet.radius * zScale < 1 ? 1 : planet.radius * zScale;
    drawCircle(planet.x, planet.y, radius, planet.color);
    if (index > 0) {
      var previous = planets[index-1];
      //drawLine(previous.x, previous.y, planet.x, planet.y, planet.color);
    }
  }

  function move(planet) {
    planet.x += planet.dx;
    planet.y += planet.dy;
    planet.z += planet.dz;

    // gravity check
    planet = _gravityCheck(planet, gravity, gravityX, gravityY, gravityZ);

  }

  function _gravityCheck(planet, gravity, gravityX, gravityY, gravityZ) {
    if (planet.x > gravityX) {
      planet.dx -= gravity;
    }
    else {
      planet.dx += gravity;
    }

    if (planet.y > gravityY) {
      planet.dy -= gravity;
    }
    else {
      planet.dy += gravity;
    }
    
    if (planet.z > gravityZ) {
      planet.dz -= gravity;
    }
    else {
      planet.dz += gravity;
    }

    return planet;
  }

  function _boundaryCheck(planet) {
    if (planet.x < 0) {
      planet.dx *= -1;
      planet.x = 0;
    }
    else if (planet.x > WORLD_WIDTH) {
      planet.x = WORLD_WIDTH;
      planet.dx *= -1;
    }

    if (planet.y < 0) {
      planet.y = 0;
      planet.dy *= -1;
    }
    else if (planet.y > WORLD_HEIGHT) {
      planet.y = WORLD_HEIGHT;
      planet.dy *= -1;
    }
  
    if (planet.z < 0) {
      planet.z = 0;
      planet.dz *= -1;
    }
    else if (planet.z > WORLD_DEPTH) {
      planet.z = WORLD_DEPTH;
      planet.dz *= -1;
    }

    return planet;
  }

  function generatePlanets(total) {
    var planets = [];
    for(var i=0; i<total; i++) {
      var x = Math.floor(Math.random() * WORLD_WIDTH);
      var y = Math.floor(Math.random() * WORLD_HEIGHT);
      var z = Math.floor(Math.random() * WORLD_DEPTH);
      var dx = Math.floor(Math.random() * 1) - 1;
      var dy = Math.floor(Math.random() * 1) - 1;
      var dz = Math.floor(Math.random() * 1) - 1;
      var radius = Math.floor(Math.random() * 5) + 1;
      //var color = '#'+Math.floor(Math.random()*16777215).toString(16);
      var color = getRandomRGBA();
      planets.push(new Planet(x, y, z, dx, dy, dz, radius, color));
    }
    return planets;
  }

  function clearCanvas() {
    context.clearRect(0,0,WORLD_WIDTH, WORLD_HEIGHT);
  }

  function update() {
    WORLD_HEIGHT = window.innerHeight;
    WORLD_WIDTH = window.innerWidth;
    var canvas = document.getElementById(canvasId);
    if (canvas.height != WORLD_HEIGHT) {
      canvas.height = WORLD_HEIGHT;
      canvas.width = WORLD_WIDTH;
    }
    planets.forEach(move);
    //clearCanvas();
    planets.forEach(draw);
  }
  
  function color() {
    return Math.floor(Math.random()*256); 
  }
  
  function getRandomRGBA() {
    return `rgba(${color()},${color()},${color()},1)`;
  }

  var planets = generatePlanets(4);
  setInterval( update, 1);
}
