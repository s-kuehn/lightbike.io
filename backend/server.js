const io = require('socket.io')({
  cors: {
    origin: 'https://lightbike.io',
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
    headers: ["Origin", "Content-Type", "Accept"]
  }

  // cors: {
  //     origin: 'http://127.0.0.1:5555'
  //   }
})
const { createGameState, gameLoop, getUpdatedVelocity, initGame } = require('./game')
const { frameRate } = require('./constants')
const { makeid } = require('./utils')

const state = {}
const clientRooms = {}

io.on('connection', client => {

  client.on('keydown', handleKeyDown)
  client.on('newGame', handleNewGame)
  client.on('joinGame', handleJoinGame)
  client.on('roomList', handleRoomList)

  function handleRoomList() {

    const playerRooms = [];

    const rooms = io.sockets.adapter.rooms

    const userRooms = [...rooms.keys()]
    userRooms.forEach(room => {
      if (room.length <= 5) {
        const roomSize = io.sockets.adapter.rooms.get(room);
        playerRooms.push([room, roomSize.size]);
      }
    });
    client.emit('roomListData', playerRooms);
  }

  function handleJoinGame(gameCode) {
    const room = io.sockets.adapter.rooms[gameCode]

    let allUsers

    if (room) {
      allUsers = room.sockets
    }

    if (allUsers) {
      numClients = Object.keys(allUsers).length
    }

    clientRooms[client.id] = gameCode

    client.join(gameCode)
    client.number = 2
    client.emit('init', 2)

    startGameInterval(gameCode)
  }

  function handleNewGame() {
    let roomName = makeid(5)
    clientRooms[client.id] = roomName
    client.emit('gameCode', roomName)

    state[roomName] = initGame()

    client.join(roomName)
    client.number = 1
    client.emit('init', 1)

  }

  function handleKeyDown(keyCode) {
    const roomName = clientRooms[client.id]

    if (!roomName) {
      return
    }

    try {
      keyCode = parseInt(keyCode)
    } catch (e) {
      console.error(e)
      return
    }

    const vel = getUpdatedVelocity(keyCode)
    console.log(vel.y)

    if (state[roomName]) {
      // Prevent player from going the direct oposite direction and dying
      if (Math.abs(state[roomName].players[client.number - 1].vel.y - vel.y) > 1 || Math.abs(state[roomName].players[client.number - 1].vel.x - vel.x) > 1) {
        return
      } else {
        if (vel) {
          state[roomName].players[client.number - 1].vel = vel
        }
      }
    }

    // if (vel) {
    //     state[roomName].players[client.number - 1].vel = vel
    // }


  }

})

function startGameInterval(roomName) {
  const intervalId = setInterval(() => {
    const winner = gameLoop(state[roomName])

    if (!winner) {
      emitGameState(roomName, state[roomName])
    } else {
      emitGameOver(roomName, winner)
      state[roomName] = null
      clearInterval(intervalId)
    }
  }, 1000 / frameRate)
}

function emitGameState(roomName, state) {
  io.sockets.in(roomName).emit('gameState', JSON.stringify(state))
}

function emitGameOver(roomName, winner) {
  io.sockets.in(roomName).emit('gameOver', JSON.stringify({ winner }))
}

io.listen(process.env.PORT || 3000)
console.log(`server started on port ${process.env.PORT || 3000}!`);
