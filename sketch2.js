
let songs; // Variable to store the dance data
let diskRadius; // Radius of the disk
let rotationSpeed = 0.003; // Speed of rotation
let selectedBar = -1; // Index of the selected bar
let currentAttribute = 'Tempo'; // Current attribute to display
let gradientColors = []; // Array to store the pre-calculated gradient colors
let selectedKey = '1'; // Variable to store the selected key
let showTitle = true; // Variable to control the visibility of the title

function preload() {
  // Load the dance data from a CSV file
  songs = loadTable('10_years_top_tracks_all.csv', 'csv', 'header');
}

function setup() {
  var canvas = createCanvas(650, 650);
  canvas.parent('barCanvas2')
  background('#12132d');
  frameRate(120); // Adjust the value (e.g., 30 fps) to achieve smoother rotation


  // Calculate the radius of the disk based on the canvas size
  diskRadius = min(width, height) * 0.4;
  // Pre-calculate the gradient colors
  for (let x = 0; x < 250; x++) {
    let inter = map(x, 0, 250, 0, 1);
    let lerpedColor = lerpColor(color(255), color(128, 0, 255), inter);
    gradientColors.push(lerpedColor);
  }
}

function draw() {
  background('#12132d');
  translate(width / 2, height / 2); // Move the origin to the center of the canvas

  
  // Rotate the entire scene
  rotate(frameCount * rotationSpeed);
  
   
  // Find the minimum and maximum attribute values
  let minAttributeValue = Infinity;
  let maxAttributeValue = -Infinity;
  for (let i = 0; i < songs.getRowCount(); i++) {
    let attributeValue = songs.getNum(i, currentAttribute);
    minAttributeValue = min(minAttributeValue, attributeValue);
    maxAttributeValue = max(maxAttributeValue, attributeValue);
  }

  // Iterate through each row in the dance data
  for (let i = 0; i < songs.getRowCount(); i++) {
    let attributeValue = songs.getNum(i, currentAttribute);

    let barHeight = diskRadius * attributeValue; // Scale the height based on the attribute value
    let barWidth = TWO_PI / songs.getRowCount(); // Width of each bar

    // Calculate the angle range for each bar
    let startAngle = i * barWidth;
    let endAngle = startAngle + barWidth;

    // Calculate the position of each bar on the circular path
    let x = diskRadius * cos(startAngle);
    let y = diskRadius * sin(startAngle);

    // Calculate the position of the next bar
    let nextX = diskRadius * cos(endAngle);
    let nextY = diskRadius * sin(endAngle);

//     // Calculate the color based on the attribute value
// let gradientColor = lerpColor(color(255), color(128, 0, 255), map(attributeValue, minAttributeValue, maxAttributeValue, 0, 1));
    let gradientColor;
    if (currentAttribute !== '') {
      gradientColor = lerpColor(
        color(255),
        color(128, 0, 255),
        map(attributeValue, minAttributeValue, maxAttributeValue, 0, 1)
      );
    } else {
      gradientColor = color(128);
    }

// Highlight the selected bar
if (i === selectedBar) {
  gradientColor = color(255, 255, 0);
}


    fill(gradientColor);
    noStroke();
    beginShape();
    vertex(x, y); // Start the shape at the current bar position
    vertex(nextX, nextY); // Connect the next bar position
    vertex(0, 0); // Connect to the center of the disk
    endShape(CLOSE); // Close the shape

    // Draw a small circle at the center of the disk
    fill(150);
    ellipse(0, 0, 170, 170);
    fill(200);
    ellipse(0, 0, 150, 150);
    fill(190);
    ellipse(0, 0, 100, 100);
    fill('#12132d');
    ellipse(0, 0, 50, 50);
    
    
    
  push();
rotate(-frameCount * rotationSpeed);

let rectWidth = 250; // Width of each mini rectangle
let rectHeight = 20; // Height of each mini rectangle
let rectCount = 20; // Number of mini rectangles

for (let i = 0; i < rectCount; i++) {
  let x = -120 + (i * rectWidth) / rectCount; // Calculate the x position of each mini rectangle
  let gColor = lerpColor(color(255), color(128, 0, 255), i / rectCount); // Calculate the color for each mini rectangle

  fill(gColor);
  rect(x, 300, rectWidth / rectCount, rectHeight);
}

fill(255);
text('The darker the colour the higher the audio feature', -130, 290);

pop();

    
  }

  // Display the information of the selected bar without rotation
  push();
  rotate(-frameCount * rotationSpeed); // Reverse the rotation to cancel out the scene rotation
  displayTrackInfo();
  pop();
  
  // Display the keys to press in the top right corner
textAlign(LEFT);
fill(255);
  rotate(-frameCount * rotationSpeed);
  text('Number to display', 210, -310);
let keysText = '';
keysText += '1: Tempo\n';
keysText += '2: Danceability\n';
keysText += '3: Energy\n';
keysText += '4: Instrumentalness\n';
keysText += '5: Valence\n';
keysText += '6: Speechiness\n';
keysText += '7: Loudness\n';
keysText += '8: Acousticness\n';
keysText += '9: Liveness\n';
  
  
  // Highlight the selected key
  if (selectedKey !== '') {
    let keyIndex = int(selectedKey) - 1;
    let lines = keysText.split('\n');
    if (keyIndex >= 0 && keyIndex < lines.length) {
      lines[keyIndex] = '--> ' + lines[keyIndex];
     
      keysText = lines.join('\n');
    }
  }
text(keysText, 200, -290);
  
  if (showTitle) {
     
    displayTitle();
  }


}

function mouseClicked() {
  // Check if the mouse is within the bounds of a bar
  let barWidth = TWO_PI / songs.getRowCount();

  for (let i = 0; i < songs.getRowCount(); i++) {
    // Calculate the angle range for the current bar
    let startAngle = i * barWidth;
    let endAngle = startAngle + barWidth;

    // Calculate the distance from the mouse to the center of the disk
    let mouseToCenterDistance = dist(mouseX, mouseY, width / 2, height / 2);

    // Calculate the angle of the mouse relative to the center of the disk
    let mouseAngle = atan2(mouseY - height / 2, mouseX - width / 2);

    // Adjust the mouse angle based on the rotation of the scene
    mouseAngle -= frameCount * rotationSpeed;

    // Ensure the mouse angle is within the range of 0 to TWO_PI
    while (mouseAngle < 0) {
      mouseAngle += TWO_PI;
    }
    while (mouseAngle >= TWO_PI) {
      mouseAngle -= TWO_PI;
    }

    // Check if the mouse is within the angle range and close enough to the center
    if (
      mouseToCenterDistance < diskRadius &&
      mouseAngle >= startAngle &&
      mouseAngle < endAngle
    ) {
      selectedBar = i;
      break;
    }
  }
}

function displayTrackInfo() {
  if (selectedBar >= 0 && selectedBar < songs.getRowCount()) {
    let trackName = songs.getString(selectedBar, 'Track');
    let artist = songs.getString(selectedBar, 'Artists');
    let year = songs.getString(selectedBar, 'Year');
    let attributeValue = songs.getNum(selectedBar, currentAttribute);

    fill(255);
    textAlign(LEFT);
    text('Track: ' + trackName, -width / 2 + 20, -height / 2 + 40);
    text('Artist: ' + artist, -width / 2 + 20, -height / 2 + 60);
    text('Year: ' + year, -width / 2 + 20, -height / 2 + 80);
    text(currentAttribute + ': ' + attributeValue, -width / 2 + 20, -height / 2 + 100);
  }
}

function displayTitle() {
  fill(255);
  
 let selectedKeyText = '';
  if (selectedKey !== '') {
    let keyIndex = int(selectedKey) - 1;
    let attributeKeys = [
      'Tempo',
      'Danceability',
      'Energy',
      'Instrumentalness',
      'Valence',
      'Speechiness',
      'Loudness',
      'Acousticness',
      'Liveness'
    ];
    if (keyIndex >= 0 && keyIndex < attributeKeys.length) {
      selectedKeyText = 'Selected Key: ' + attributeKeys[keyIndex];
    } else {
      selectedKeyText = 'No Key Selected';
    }
  }
  text(selectedKeyText, -50, -300);
}

function keyPressed() {
  if (key >= '1' && key <= '9') {
    selectedKey = key;
    showTitle = true; // Show the title when a key is selected

    // Update the current attribute based on the selected key
    let keyIndex = int(key) - 1;
    let attributeKeys = [
      'Tempo',
      'Danceability',
      'Energy',
      'Instrumentalness',
      'Valence',
      'Speechiness',
      'Loudness',
      'Acousticness',
      'Liveness'
    ];
    if (keyIndex >= 0 && keyIndex < attributeKeys.length) {
      currentAttribute = attributeKeys[keyIndex];
    }
  
  }
}

