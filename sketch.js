
var a = function( p ) { 
    let angle = 0;

    p.setup = function() {
      p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
    };
  
    p.draw = function() {
      p.background('#12132d');
  
      p.rotateY(angle);
  
      // Turntable base
      p.push();
      p.rotateX(90);
      p.fill(0);
      p.cylinder(300, 10, 24);
      p.pop();
  
      // Larger Disk label
      p.push();
      p.translate(0, 0, -5); // Move label slightly behind the base
      p.rotateX(90); // Rotate label to be flat
      let labelColor = p.color(0, 0, 0);
      labelColor.setAlpha(200); // Set opacity
      p.fill(labelColor);
      p.cylinder(60, 30, 60);
  
      let innerLabelColor = p.color(255);
      innerLabelColor.setAlpha(100); // Set opacity
      p.fill(innerLabelColor);
      p.cylinder(60, 30, 60);
      p.pop();
  
      // Smaller Disk
      p.push();
      p.rotateX(90);
      let smallDiskColor = p.color(255);
      smallDiskColor.setAlpha(200); // Set opacity
      p.fill(smallDiskColor);
      p.cylinder(100, 20, 50);
      p.pop();
  
      angle += 0.03;
    };
};

var myp5 = new p5(a, 'c7');

