const { gridSize } = require('./constants')

module.exports = {
    initGame,
    gameLoop,
    getUpdatedVelocity,
}

function initGame() {
    const state = createGameState()
    randomFood(state)
    return state
}

function createGameState() {
    return {
        players: [{
            pos: {
                x: 20,
                y: 3,
            },
            vel: {
                x: 0,
                y: 1,
            },
            snake: [
                {x: 20, y: 1},
                {x: 20, y: 2},
                {x: 20, y: 3},
            ],
        }, {
            pos: {
                x: 20,
                y: 36,
            },
            vel: {
                x: 0,
                y: -1,
            },
            snake: [
                {x: 20, y: 38},
                {x: 20, y: 37},
                {x: 20, y: 36},
            ],
        }],
        food: {},
        gridSize: gridSize,
    }
}

function gameLoop(state) {

    let eatApple = false

    if (!state) {
        return
    }

    const playerOne = state.players[0]
    const playerTwo = state.players[1]

    playerOne.pos.x += playerOne.vel.x
    playerOne.pos.y += playerOne.vel.y

    playerTwo.pos.x += playerTwo.vel.x
    playerTwo.pos.y += playerTwo.vel.y

    if (playerOne.pos.x < 0 || playerOne.pos.x > gridSize - 1 || playerOne.pos.y < 0 || playerOne.pos.y > gridSize - 1) {
        return 2
    }

    if (playerTwo.pos.x < 0 || playerTwo.pos.x > gridSize - 1 || playerTwo.pos.y < 0 || playerTwo.pos.y > gridSize - 1) {
        return 1
    }

    if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
        playerOne.snake.push({ ...playerOne.pos })
        playerOne.pos.x += playerOne.vel.x
        playerOne.pos.y += playerOne.vel.y
        randomFood(state)
    }

    if (state.food.x === playerTwo.pos.x && state.food.y === playerTwo.pos.y) {
        playerTwo.snake.push({ ...playerTwo.pos })
        playerTwo.pos.x += playerTwo.vel.x
        playerTwo.pos.y += playerTwo.vel.y
        randomFood(state)
    }

    if (playerOne.vel.x || playerOne.vel.y) {
        for (let cell of playerOne.snake) {
            if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
                return 2
            }
        }

        for (let cell of playerTwo.snake) {
            if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
                return 2
            }
        }

        playerOne.snake.push({ ...playerOne.pos })

        if (eatApple) {
            setTimeout( () => {
                playerOne.snake.shift()
            }, 3000)
        } else {
            setTimeout( () => {
                playerOne.snake.shift()
            }, 3000)
        }
    }

    if (playerTwo.vel.x || playerTwo.vel.y) {
        for (let cell of playerTwo.snake) {
            if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
                return 1
            }
        }

        for (let cell of playerOne.snake) {
            if (cell.x === playerTwo.pos.x && cell.y === playerTwo.pos.y) {
                return 1
            }
        }

        playerTwo.snake.push({ ...playerTwo.pos })

        if (eatApple) {
            setTimeout( () => {
                playerTwo.snake.shift()
            }, 5000)
        } else {
            setTimeout( () => {
                playerTwo.snake.shift()
            }, 5000)
        }
    }

    return false
}

function randomFood(state) {
    food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
    }

    for (let cell of state.players[0].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state)
        }
    }

    for (let cell of state.players[1].snake) {
        if (cell.x === food.x && cell.y === food.y) {
            return randomFood(state)
        }
    }

    state.food = food
}

function getUpdatedVelocity(keyCode) {
    switch (keyCode) {
        // Left Arrow Key
        case 37: {
            return { x: -1, y: 0 }
        }
        // 'A' Key
        case 65: {
            return { x: -1, y: 0 }
        }
        // 'W' Key
        case 87: {
            return { x: 0, y: -1 }
        }
        // Up Arrow Key
        case 38: {
            return { x: 0, y: -1 }
        }
        // Right Arrow Key
        case 39: {
            return { x: 1, y: 0 }
        }
        // 'D' Key
        case 68: {
            return { x: 1, y: 0 }
        }
        // Down Arrow Key
        case 40: {
            return { x: 0, y: 1 }
        }
        // 'S' Key
        case 83: {
            return { x: 0, y: 1 }
        } default:
            return ''
    }
}