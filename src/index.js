import Konva from 'konva';

// Make functions available globally
window.changeColor = null;
window.activateTool = null;

var width = window.innerWidth;
var height = window.innerHeight - 25;

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});

var layer = new Konva.Layer();
stage.add(layer);

var isPaint = false;
var lastPointerPosition;
var mode = 'brush';
var currentColor = '#ffffff';
var lastLine;

// Function to change color
window.changeColor = function(color) {
  console.log('Changing color to:', color);
  
  // Remove selected class from all circles
  document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
  
  // Add selected class to clicked circle
  document.querySelector(`[data-color="${color}"]`).classList.add('selected');
  
  // Update current color
  currentColor = color;
};

// Function to activate tools
window.activateTool = function(toolName) {
  console.log('Activating tool:', toolName);
  
  // Update active button
  document.querySelectorAll('.tool-button').forEach(b => b.classList.remove('active'));
  document.querySelector(`[data-tool="${toolName}"]`).classList.add('active');
  
  // Update mode
  mode = toolName;
};

// Handle color selection
document.querySelectorAll('.color-circle').forEach(circle => {
  circle.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    // Remove selected class from all circles
    document.querySelectorAll('.color-circle').forEach(c => c.classList.remove('selected'));
    
    // Add selected class to clicked circle
    this.classList.add('selected');
    
    // Update current color
    currentColor = this.dataset.color;
  });
});

// Handle tool selection
document.querySelectorAll('.tool-button').forEach(button => {
  button.addEventListener('click', function(e) {
    e.stopPropagation();
    
    if (this.dataset.tool === 'save') {
      const dataURL = stage.toDataURL();
      console.log(JSON.stringify({ image: dataURL, date: Date.now() }));
      return;
    }
    
    // Update active button
    document.querySelectorAll('.tool-button').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    
    // Update mode
    mode = this.dataset.tool;
  });
});

// Initialize with brush mode and white color
window.activateTool('brush');
window.changeColor('#ffffff');

stage.on('pointerdown', function(e) {
  isPaint = true;
  lastPointerPosition = stage.getPointerPosition();
  
  // Create a new line
  lastLine = new Konva.Line({
    stroke: currentColor,
    strokeWidth: mode === 'brush' ? 3 : 40,
    globalCompositeOperation: mode === 'brush' ? 'source-over' : 'destination-out',
    points: [lastPointerPosition.x, lastPointerPosition.y],
    lineCap: 'round',
    lineJoin: 'round'
  });
  layer.add(lastLine);
});

stage.on('pointerup', function() {
  isPaint = false;
});

stage.on('pointermove', function() {
  if (!isPaint) {
    return;
  }

  const pos = stage.getPointerPosition();
  if (!pos) return;

  // Add point to line
  const newPoints = lastLine.points().concat([pos.x, pos.y]);
  lastLine.points(newPoints);
  layer.batchDraw();
});

