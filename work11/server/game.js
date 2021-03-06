const express = require('express');
const gameRouter = express.Router();

class GameController {

    *getNumberGenerator() {

        const arr = [];

        for (let i = 0; i < 16; i++) {
            arr.push(i + 1);
        }

        for (let i = 0; i < 16; i++) {

            const randI = Math.floor(Math.random() * arr.length);
            const value = arr[randI];

            arr.splice(randI, 1);

            yield value;
        }

    }

    getRandomColor() {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);

        return `rgb(${r},${g},${b})`;
    }

    getNewGame() {

        const gen = this.getNumberGenerator();
        const b = [];

        for (let i = 0; i < 4; i++) {

            b[i] = [];

            for (let j = 0; j < 4; j++) {

                const text = gen.next().value;
                const visible = text !== 16;
                const color = this.getRandomColor();

                b[i][j] = {
                    color,
                    text,
                    visible,
                    row: i,
                    column: j
                }
            }
        }

        return b;
    }

    getEmptyNearCell(board, cell) {

        for (let i = 0; i < 4; i++) {

            for (let j = 0; j < 4; j++) {

                const dist = Math.abs(cell.row - i) + Math.abs(cell.column - j);

                if (dist === 1 && board[i][j].text === 16) {
                    return Object.assign({}, board[i][j]);
                }
            }
        }

        return null;
    }

    moveElement(board, cell) {

        const empty = this.getEmptyNearCell(board, cell);

        if (empty) {

            board[empty.row][empty.column].color = cell.color;
            board[empty.row][empty.column].text = cell.text;
            board[empty.row][empty.column].visible = cell.visible;

            board[cell.row][cell.column].color = empty.color;
            board[cell.row][cell.column].text = empty.text;
            board[cell.row][cell.column].visible = empty.visible;
        }

        return board;
    }

    isFinish(board) {
        return (
            board[0][0].text === 1 &&
            board[0][1].text === 2
        );
    }
}

const gameCtl = new GameController();

gameRouter.get('/start-new-game', (req, res) => {
    res.json(gameCtl.getNewGame());
});

gameRouter.post('/move-cell', (req, res) => {

    const { board, cell } = req.body;

    res.json(gameCtl.moveElement(board, cell));

});

gameRouter.post('/did-finish', (req, res) => {

    const {board} = req.body;

    res.json({ fihish: gameCtl.isFinish(board) });
});

module.exports = gameRouter;
