// const trailColors = ['#eff77d', '#4ab2ff', '#b3f0ef', '#f75100', '#cd0000', '#1173b7']

const bgColor = '#231f20'
// const snakeColor = trailColors[Math.floor(Math.random() * trailColors.length)]
const foodColor = '#e66916'

const socket = io.connect('http://localhost:3000');

socket.on('init', handleInit)
socket.on('gameState', handleGameState)
socket.on('gameOver', handleGameOver)
socket.on('gameCode', handleGameCode)
socket.on('unkownGame', handleUnkownGame)
socket.on('tooManyPlayers', handleTooManyPlayers)

const gameScreen = document.getElementById('game-screen')
const initialScreen = document.getElementById('initial-screen')
const newGameBtn = document.getElementById('new-game-button')
const joinGameBtn = document.getElementById('join-game-button')
const quickJoinBtn = document.getElementById('quick-join-button')
const gameCodeInput = document.getElementById('game-code-input')
const gameCodeDisplay = document.getElementById('game-code-display')

newGameBtn.addEventListener('click', newGame)
joinGameBtn.addEventListener('click', joinGame)
quickJoinBtn.addEventListener('click', quickJoin)

function quickJoin() {
  socket.emit('roomList');
}

socket.on('roomListData', (data) => {
  console.log(data);
  data.forEach(server => {
    if (server[1] < 2) {
      socket.emit('joinGame', server[0])
      init();
    }
  });
});

function newGame() {
  socket.emit('newGame')
  init()
}

function joinGame() {
  const code = gameCodeInput.value
  socket.emit('joinGame', code)
  init()
}

let canvas, ctx
let playerNumber
let gameActive = false

function init() {
  initialScreen.style.display = 'none'
  gameScreen.style.display = 'block'

  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  canvas.width = 800
  canvas.height = 800

  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  document.addEventListener('keydown', keydown)
  gameActive = true
}

function keydown(e) {
  console.log(e.keyCode)
  socket.emit('keydown', e.keyCode)
}

function paintGame(state) {
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const food = state.food
  const gridSize = state.gridSize
  const size = canvas.width / gridSize

  ctx.fillStyle = foodColor
  ctx.fillRect(food.x * size, food.y * size, size, size)

  // Choose color for each player
  paintPlayer(state.players[0], size, '#6589eb')
  paintPlayer(state.players[1], size, '#bf042a')
}

function paintPlayer(playerState, size, color) {
  const snake = playerState.snake

  for (let cell of snake) {
    if (cell === snake[snake.length - 1]) {
      ctx.fillStyle = '#fff'
    } else {
      ctx.fillStyle = color
    }
    ctx.fillRect(cell.x * size, cell.y * size, size, size)
  }
}

function handleInit(number) {
  playerNumber = number
}

function handleGameState(gameState) {
  if (!gameActive) {
    return
  }

  gameState = JSON.parse(gameState)
  requestAnimationFrame(() => paintGame(gameState))
}

function handleGameOver(data) {
  if (!gameActive) {
    return
  }
  data = JSON.parse(data)

  if (data.winner === playerNumber) {
    alert('You Win!')
  } else {
    alert('You Loose!')
  }
  gameActive = false
}

function handleGameCode(gameCode) {
  gameCodeDisplay.innerText = gameCode
}

function handleUnkownGame() {
  reset()
  alert('Unknown game code')
}

function handleTooManyPlayers() {
  reset()
  alert('This game is already in-progress')
}

function reset() {
  playerNumber = null
  gameCodeInput.value = ''
  gameCodeDisplay.innerText = ''
  initialScreen.style.display = 'block'
  gameScreen.style.display = 'none'
}
