const { gridSize } = require('./constants')

module.exports = {
    createGameState,
    gameLoop,
    getUpdatedVelocity,
}

function createGameState() {
    return {
        player: {
            pos: {
                x: 3,
                y: 10,
            },
            vel: {
                x: 1,
                y: 0,
            },
            snake: [
                {x: 1, y: 10},
                {x: 2, y: 10},
                {x: 3, y: 10},
            ],
        },
        food: {
            x: 7,
            y: 7,
        },
        gridSize: gridSize,
    }
}

function gameLoop(state) {
    if (!state) {
        return
    }

    const playerOne = state.player

    playerOne.pos.x += playerOne.vel.x
    playerOne.pos.y += playerOne.vel.y

    if (playerOne.pos.x < 0 || playerOne.pos.x > gridSize || playerOne.pos.y < 0 || playerOne.pos.y > gridSize) {
        return 2
    }

    if (state.food.x === playerOne.pos.x && state.food.y === playerOne.pos.y) {
        playerOne.snake.push({ ...playerOne.pos })
        playerOne.pos.x += playerOne.vel.x
        playerOne.pos.y += playerOne.vel.y
        randomFood(state)
    }

    if (playerOne.vel.x || playerOne.vel.y) {
        for (let cell of playerOne.snake) {
            if (cell.x === playerOne.pos.x && cell.y === playerOne.pos.y) {
                return 2
            }
        }


        playerOne.snake.push({ ...playerOne.pos })

        setTimeout( () => {
            playerOne.snake.shift()
        }, 5000)


    }

    return false
}

function randomFood(state) {
    food = {
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
    }

    for (let cell of state.player.snake) {
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
        }
    }
}