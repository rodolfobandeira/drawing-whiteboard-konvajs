import Konva from 'konva';

/*
function component() {
  const element = document.createElement('div');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  return element;
}

document.body.appendChild(component());
*/


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

  if (mode === 'brush') {
    context.globalCompositeOperation = 'source-over';
    context.lineWidth = 3;
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

