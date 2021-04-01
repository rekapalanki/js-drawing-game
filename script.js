// Grab elements

const canvas = document.querySelector('#drawing-game');
const ctx = canvas.getContext('2d');

// Setup canvas 

const {width, height} = canvas;
let [x, y] = [
  Math.floor(Math.random()*width),
  Math.floor(Math.random()*height),
]

ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.lineWidth = 10;

ctx.fillStyle = '#000';
ctx.fillRect(0,0,width, height);

ctx.beginPath();
ctx.strokeStyle = '#fff'
ctx.moveTo(x, y);
ctx.lineTo(x, y);
ctx.stroke();

// Create draw function 

const draw = ({key}) => { 
  console.log(key);
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