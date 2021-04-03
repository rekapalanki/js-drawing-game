// Grab elements

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const shake = document.querySelector('.shake');
const uniContainer = document.querySelector('.unicorn-container');
const LINE_WIDTH = 10;
const unicornHTML = `
  <img class="rainbow-unicorn" src="./src/Rainbow_unicorn_badge.JPG" alt="rainbow-unicorn-badge">
`;
const unicornFragment = document.createRange().createContextualFragment(unicornHTML);
const unicorn = unicornFragment.querySelector('img');

// Setup canvas 

const {width, height} = canvas;
let [x, y, hue] = [
  Math.floor(Math.random()*width),
  Math.floor(Math.random()*height),
  0
]

ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = LINE_WIDTH;

const rect = () => {
  ctx.fillStyle = '#555';
  ctx.fillRect(0, 0, width, height)
}

const startPoint = () =>  {
  ctx.beginPath();
  ctx.strokeStyle = `hsl(${hue}, 100%, 75%)`;
  ctx.moveTo(x, y);
  ctx.lineTo(x, y);
  ctx.stroke();
}

rect();
startPoint();

// Create draw function 

const draw = ({key}) => {
  console.log(key);
  hue += 3;
  ctx.beginPath();
  ctx.strokeStyle = `hsl(${hue}, 100%, 75%)`;
  ctx.moveTo(x, y);
  switch (key) {
    case 'ArrowUp':
      y -= LINE_WIDTH;
      break;

    case 'ArrowDown':
      y += LINE_WIDTH;
      break;

    case 'ArrowLeft':
      x -= LINE_WIDTH;
      break;
  
    case 'ArrowRight':
      x += LINE_WIDTH;
      break;

    default:
      break;
  }
  ctx.lineTo(x, y);
  ctx.stroke();
}

// Create Arrow event handler

const arrowHandler = (event) => {
  event.stopPropagation();
  if (event.key.includes('Arrow')) {
    event.preventDefault();
    draw({key: event.key});
  };
}

// Add event listener

window.addEventListener('keydown', arrowHandler)

// Create clear function and click event listener

const removeShake = () => {
  canvas.classList.remove('shake');
  unicorn.classList.remove('big');
}

const clickHandler = (event) => {
  event.stopPropagation();
  ctx.clearRect(0, 0, width, height);
  rect();
  startPoint();
  canvas.classList.add('shake');
  canvas.addEventListener('animationend', removeShake, { once: true });
  uniContainer.appendChild(unicorn);
  unicorn.classList.add('big');
}

shake.addEventListener('click', clickHandler);
shake.addEventListener('touchstart', clickHandler);

// Handling touch events

function startup() {
  canvas.addEventListener("touchstart", handleStart, false);
  canvas.addEventListener("touchend", handleEnd, false);
  canvas.addEventListener("touchcancel", handleCancel, false);
  canvas.addEventListener("touchmove", handleMove, false);
}

document.addEventListener("DOMContentLoaded", startup);

var ongoingTouches = [];

function handleStart(evt) {
  evt.preventDefault();
  console.log("touchstart.");
  var el = document.getElementById("canvas");
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    console.log("touchstart:" + i + "...");
    ongoingTouches.push(copyTouch(touches[i]));
    var color = colorForTouch(touches[i]);
    ctx.beginPath();
    ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
    ctx.fillStyle = color;
    ctx.fill();
    console.log("touchstart:" + i + ".");
  }
}

function handleMove(evt) {
  evt.preventDefault();
  var el = document.getElementById("canvas");
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      console.log("continuing touch "+idx);
      ctx.beginPath();
      console.log("ctx.moveTo(" + ongoingTouches[idx].pageX + ", " + ongoingTouches[idx].pageY + ");");
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      console.log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.lineWidth = 4;
      ctx.strokeStyle = color;
      ctx.stroke();

      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
      console.log(".");
    } else {
      console.log("can't figure out which touch to continue");
    }
  }
}

function handleEnd(evt) {
  evt.preventDefault();
  log("touchend");
  var el = document.getElementById("canvas");
  var ctx = el.getContext("2d");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var color = colorForTouch(touches[i]);
    var idx = ongoingTouchIndexById(touches[i].identifier);

    if (idx >= 0) {
      ctx.lineWidth = 4;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(ongoingTouches[idx].pageX, ongoingTouches[idx].pageY);
      ctx.lineTo(touches[i].pageX, touches[i].pageY);
      ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    } else {
      console.log("can't figure out which touch to end");
    }
  }
}

function handleCancel(evt) {
  evt.preventDefault();
  console.log("touchcancel.");
  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    ongoingTouches.splice(idx, 1);  // remove it; we're done
  }
}

function colorForTouch(touch) {
  var r = touch.identifier % 16;
  var g = Math.floor(touch.identifier / 3) % 16;
  var b = Math.floor(touch.identifier / 7) % 16;
  r = r.toString(16); // make it a hex digit
  g = g.toString(16); // make it a hex digit
  b = b.toString(16); // make it a hex digit
  var color = "#" + r + g + b;
  console.log("color for touch with identifier " + touch.identifier + " = " + color);
  return color;
}

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;

    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}

function log(msg) {
  var p = document.getElementById('log');
  p.innerHTML = msg + "\n" + p.innerHTML;
}

function onTouch(evt) {
  evt.preventDefault();
  if (evt.touches.length > 1 || (evt.type == "touchend" && evt.touches.length > 0))
    return;

  var newEvt = document.createEvent("MouseEvents");
  var type = null;
  var touch = null;

  switch (evt.type) {
    case "touchstart":
      type = "mousedown";
      touch = evt.changedTouches[0];
      break;
    case "touchmove":
      type = "mousemove";
      touch = evt.changedTouches[0];
      break;
    case "touchend":
      type = "mouseup";
      touch = evt.changedTouches[0];
      break;
  }

  newEvt.initMouseEvent(type, true, true, evt.originalTarget.ownerDocument.defaultView, 0,
    touch.screenX, touch.screenY, touch.clientX, touch.clientY,
    evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, null);
  evt.originalTarget.dispatchEvent(newEvt);
}

