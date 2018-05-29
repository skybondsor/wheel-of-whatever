/* global Canvasimo */

'use strict';

window.onload = function(){
  updateWheel();
}

function updateWheel(){

  var element = document.getElementById('canvas');
      element.removeEventListener('click', onClick);
  
  var canvas = new Canvasimo(element);
  var raf;

  var items = document.getElementById("wheelItems").value.split(',');

  var velocity = 0;
  var rotation = 360 - (360 / items.length / 2);
  var triangleRotation = 0;

  function draw () {
    window.cancelAnimationFrame(raf);

    var width = window.innerWidth;
    var height = window.innerWidth;
    var radius = Math.min(width, height) * 0.4;

    var currentIndex = (items.length - 1) - Math.floor(((rotation) % 360) / (360 / items.length));

    canvas
      .setSize(width, height)
      .setFontFamily('arial')
      .setFill('black')
      .setStroke('black')
      .setStrokeWidth(1)
      .setStrokeCap('round')
      .setStrokeJoin('round')
      .setTextAlign('end')
      .setTextBaseline('middle')
      .setFontSize(radius * 0.1)
      .translate(width / 2, height / 2)
      .save()
      .rotate(canvas.getRadiansFromDegrees(rotation))
      .forEach(items, function (value, index) {
        canvas
          .save()
          .beginPath()
          .moveTo(0, 0)
          .plotArc(0, 0, radius, 0, Math.PI * 2 / items.length)
          .closePath()
          .fill(canvas.createHSL((index * 100) % 360, 80, 70))
          .stroke()
          .rotate(Math.PI * 2 / items.length * 0.5)
          .setStrokeWidth(6)
          .strokeText(value, radius * 0.9, 0, undefined, currentIndex === index ? 'black' : 'transparent')
          .fillText(value, radius * 0.9, 0, undefined, currentIndex === index ? 'white' : 'black')
          .restore()
          .rotate(Math.PI * 2 / items.length);
      })
      .forEach(items, function () {
        canvas
          .plotCircle(radius, 0, radius * 0.02)
          .fill('gray')
          .stroke('black')
          .rotate(Math.PI * 2 / items.length);
      })
      .restore()
      .translate(radius * 1.1, 0)
      .tap(function () {
        var closeToPin = rotation % (360 / items.length);

        if (closeToPin <= 2) {
          velocity *= 0.95;
        }

        if (closeToPin <= 10) {
          triangleRotation -= velocity * 20;
        }

        triangleRotation = Math.max(Math.min(triangleRotation, 0), -90);

        canvas
          .rotate(canvas.getRadiansFromDegrees(triangleRotation));

        triangleRotation *= 0.8;
      })
      .beginPath()
      .moveTo(-radius * 0.15, 0)
      .lineTo(radius * 0.05, -radius * 0.05)
      .lineTo(radius * 0.05, radius * 0.05)
      .closePath()
      .fill('red')
      .stroke('black')
      .plotCircle(0, 0, radius * 0.02, false, 'black')
      .fill('grey')
      .stroke('black');

    rotation += velocity;
    velocity *= 0.99;

    if (velocity >= 0.05 || triangleRotation <= -0.1) {
      raf = window.requestAnimationFrame(draw);
    } else {
      velocity = 0;
    }
  }

  function onClick (event) {
    if (event.touches && event.touches.length) {
      event.clientX = event.touches[0].clientX;
      event.clientY = event.touches[0].clientY;
    }

    var width = window.innerWidth;
    var height = window.innerWidth;
    var radius = Math.min(width, height) * 0.4;

    if (canvas.getDistance(event.clientX, event.clientY, width / 2, height / 2) <= radius) {
      velocity = 10 + (Math.random() * 40);
      raf = window.requestAnimationFrame(draw);
    }
  }

  function resize () {
    raf = window.requestAnimationFrame(draw);
  }

  function init () {
    resize();
    window.addEventListener('resize', resize);
    element.addEventListener('click', onClick);
  }

  init();

}
