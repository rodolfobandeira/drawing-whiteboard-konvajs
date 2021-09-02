import Konva from 'konva';

var width = window.innerWidth;
var height = window.innerHeight - 25;

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height
});

var layer = new Konva.Layer();
stage.add(layer);

var canvas = document.createElement('canvas');
canvas.width = stage.width();
canvas.height = stage.height();

var image = new Konva.Image({
  image: canvas,
  x: 0,
  y: 0
});
layer.add(image);
stage.draw();

var context = canvas.getContext('2d');
context.strokeStyle = '#ffffff';
context.lineJoin = 'round';
context.lineCap = 'round';
context.lineWidth = 3;

var isPaint = false;
var lastPointerPosition;
var mode = 'brush';

image.on('mousedown touchstart', function() {
  isPaint = true;
  lastPointerPosition = stage.getPointerPosition();
});

stage.on('mouseup touchend', function() {
  isPaint = false;
});

stage.on('mousemove touchmove', function() {
  if (!isPaint) {
    return;
  }

  if (mode === 'white') {
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 3;
    context.strokeStyle = '#ffffff';
  }

  if (mode === 'yellow') {
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 3;
    context.strokeStyle = '#ffff33';
  }

  if (mode === 'green') {
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 3;
    context.strokeStyle = '#ccff33';
  }

  if (mode === 'red') {
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 3;
    context.strokeStyle = '#ff0000';
  }

  if (mode === 'blue') {
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 3;
    context.strokeStyle = '#0099cc';
  }

  if (mode === 'orange') {
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 3;
    context.strokeStyle = '#ff9900';
  }

  if (mode === 'pink') {
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 3;
    context.strokeStyle = '#ff0099';
  }

  if (mode === 'eraser') {
    context.globalCompositeOperation = 'destination-out';
    context.lineWidth = 40;
  }
  context.beginPath();

  var localPos = {
    x: lastPointerPosition.x - image.x(),
    y: lastPointerPosition.y - image.y()
  };
  context.moveTo(localPos.x, localPos.y);
  var pos = stage.getPointerPosition();
  localPos = {
    x: pos.x - image.x(),
    y: pos.y - image.y()
  };

  context.lineTo(localPos.x, localPos.y);
  context.closePath();
  context.stroke();
  lastPointerPosition = pos;
  layer.batchDraw();
});

var select = document.getElementById('tool');
select.addEventListener('change', function() {
  mode = select.value;

  if (mode == 'save') {
    console.log(JSON.stringify({ image: canvas.toDataURL(), date: Date.now() }));
  }
});

