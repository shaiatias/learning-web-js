
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const http = require('http').Server(app);
const io = require('socket.io')(http);

const gameCtl = require("./game");

app.use(bodyParser.urlencoded({ extended: true }))

io.on('connection', (socket) => {

    console.log('user connected');

    socket.on('join-game', (message) => {
        socket.join('game');
        console.log('user joined');

        gameCtl.join(socket);
        gameCtl.setNewGame(socket.id);

        io.in('game').emit('boards-update', gameCtl.getGameState());
    });

    socket.on('move-cell', (message) => {
        gameCtl.setMoveElement(socket.id, message);
        io.in('game').emit('boards-update', gameCtl.getGameState());

        if (gameCtl.getIsFinish(socket.id)) {
            socket.emit('game-completed');
        }
    });

    socket.on('reset-board', () => {
        gameCtl.setNewGame(socket.id);
        io.in('game').emit('boards-update', gameCtl.getGameState());
    });

    socket.on('disconnect', () => {


        socket.leave('game');
        gameCtl.leave(socket)

        io.in('game').emit('boards-update', gameCtl.getGameState());

        console.log('user disconnected');
    });

});

http.listen(8080, () => {
    console.log('Server started on port 8080');
});