    /* global paper, Tool, Path, Point, Size, Symbol, view */

    paper.install(window);
    var t; 
    const MAX_HEIGHT = window.innerHeight/2;
    const MAX_WIDTH = window.innerWidth/2;
    console.log(MAX_HEIGHT);
    
    // Save SVG from paper.js as a file - http://www.mikechambers.com/blog/2014/07/01/saving-svg-content-from-paper.js
    var downloadAsSVG = function (fileName) {
      if(!fileName) {
        fileName = "paperjs_example.svg"
      }
        
      var url = "data:image/svg+xml;utf8," + encodeURIComponent(paper.project.exportSVG({asString:true}));
        
      var link = document.getElementById("downloadFile");
      link.download = fileName;
      link.href = url;
      link.click();
    }

    window.onload = function() {
      var canvas = document.getElementById('myCanvas');
      canvas.height = MAX_HEIGHT;
      canvas.width = MAX_WIDTH;
      // Setup directly from canvas id:
      paper.setup('myCanvas');      
      t = new Tool();
        
      // Place and animate shapes, based on http://andyshora.com/easy-paper-js-tutorial.html
        
      // The Path.Circle constructor takes a Point(x, y), and a radius
      var myBall = new Path.Circle(new Point(70, 70), 50);
      //myBall.fillColor = 'tomato';
         
      // The Path.Rectangle constructor can take a Point and a Size object
      var point = new Point(60, 55);
      var size = new Size(100, 50);
      var myRectangle = new Path.Rectangle(point, size);
      //myRectangle.fillColor = 'powderblue';
         
      // The Path.Line constructor takes 2 points, defining the start and end of the line.
      var from = new Point(50, 20);
      var to = new Point(200, 80);
      var straightLine = new Path.Line(from, to);
      //straightLine.strokeColor = 'black';
         
      // The Path.Arc constructor takes 3 points, var names describing the obvious.
      from = new Point(70, 120);
      var through = new Point(300, 180);
      to = new Point(170, 220);
      var curvedPath = new Path.Arc(from, through, to);
      //curvedPath.strokeColor = 'black';
        
      // Lets place some squares using symbols, and rotate each instance slightly        
      var squarePath = new Path.Rectangle(new Point(20, 20), new Size(25, 25));
      squarePath.fillColor = "#" + Math.floor(Math.random()*16777215).toString(16);
      var squareSymbol = new Symbol(squarePath);
      for (var i = 0; i < 1500; i++) {
        var placedSymbol = squareSymbol.place(new Point(Math.random() * MAX_WIDTH/2 + MAX_WIDTH/4, Math.random() * MAX_HEIGHT/2 + MAX_HEIGHT/4));
        placedSymbol.rotate(i * Math.random() * 50); // operation on the instance
      }        
        
      // Animate elements
      view.onFrame = function(event) {
        // On each frame update
        // Rotate the recetangle by 3 degrees:
        myRectangle.rotate(3);
        // Add 1 degree to the hue
        // of the symbol definition's fillColor:
        squareSymbol.definition.fillColor.hue += 1;
        // rotate
        squareSymbol.definition.rotate(5);
      }
    }