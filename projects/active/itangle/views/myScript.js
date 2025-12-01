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

      paper.setup('myCanvas');      
      t = new Tool();

         
      // The Path.Rectangle constructor can take a Point and a Size object
      var point = new Point(60, 55);
      var size = new Size(100, 50);
      
      var myRectangle = new Path.Rectangle(point, size);
        
      // Lets place some squares using symbols, and rotate each instance slightly        
      var squarePath = new Path.Rectangle(new Point(20, 20), new Size(25, 25));
      squarePath.fillColor = "#" + Math.floor(Math.random()*16777215).toString(16);
      var squareSymbol = new Symbol(squarePath);
      for (var i = 0; i < 800; i++) {
        var placedSymbol = squareSymbol.place(new Point(
          Math.random() * MAX_WIDTH/2 + MAX_WIDTH/4, 
          Math.random() * MAX_HEIGHT/10 + MAX_HEIGHT/9
        ));
        placedSymbol.rotate(i * Math.random() * 50); // operation on the instance
      } 
      
      for (var i = 0; i < 800; i++) {
        var placedSymbol = squareSymbol.place(new Point(
          Math.random() * MAX_WIDTH/2 + MAX_WIDTH/4, 
          Math.random() * MAX_HEIGHT/10 + MAX_HEIGHT/1.3
        ));
        placedSymbol.rotate(i * Math.random() * 50); // operation on the instance
      } 
      
      for (var i = 0; i < 800; i++) {
        var placedSymbol = squareSymbol.place(new Point(
          Math.random() * MAX_WIDTH/8 + MAX_WIDTH/2.25, 
          Math.random() * MAX_HEIGHT/1.75 + MAX_HEIGHT/4.5
        ));
        placedSymbol.rotate(i * Math.random() * 50); // operation on the instance
      }
        
      // Animate elements
      view.onFrame = function(event) {
        squareSymbol.definition.fillColor.hue += 1;
        squareSymbol.definition.rotate(5);
      }
    }