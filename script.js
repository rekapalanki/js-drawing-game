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

const touchHandler = (event) => {
  event.stopPropagation();
  hue += 1;
  ctx.beginPath();
  ctx.strokeStyle = `hsl(${hue}, 100%, 75%)`;
  ctx.moveTo(x, y);
  const x_2 = event.touches[0].screenX;
  const y_2 = event.touches[0].screenY;
  x = x_2;
  y = y_2;
  ctx.lineTo(x, y);
  ctx.stroke();
}

// Add event listener

window.addEventListener('keydown', arrowHandler);
window.addEventListener('touchmove', touchHandler);

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
shake.addEventListener('touchmove', clickHandler);
shake.addEventListener('touchend', clickHandler);

// Handling touch events

