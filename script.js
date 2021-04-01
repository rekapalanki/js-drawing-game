// Grab elements

const canvas = document.querySelector('#drawing-game');
const ctx = canvas.getContext('2d');
const LINE_WIDTH = 10;

// Setup canvas 

const {width, height} = canvas;
let [x, y] = [
  Math.floor(Math.random()*width),
  Math.floor(Math.random()*height),
]

ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = LINE_WIDTH;

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, width, height);

ctx.beginPath();
ctx.strokeStyle = '#fff';
ctx.moveTo(x, y);
ctx.lineTo(x, y);
ctx.stroke();

// Create draw function 

const draw = ({key}) => {
  console.log(key);
  ctx.beginPath();
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