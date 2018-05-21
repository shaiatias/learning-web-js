
function* getNumberGenerator() {

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

function getRandomColor() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);

    return `rgb(${r},${g},${b})`;
}

function getNewBoard() {

    const gen = this.getNumberGenerator();
    const b = [];

    for (let i = 0; i < 4; i++) {

        for (let j = 0; j < 4; j++) {

            const text = gen.next().value;
            const visible = text !== 16;
            const color = this.getRandomColor();

            b[i * 4 + j] = {
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

function prepareBoard() {

    const board = getNewBoard();

    for (let cell of board) {

        $("x-game").append(`
            <button style="
                        background-color: ${!cell.visible ? 'transparent' : cell.color};
                        color: ${!cell.visible ? 'transparent' : 'black'};
                        position: absolute;
                        width: 50px;
                        height: 50px;
                        outline: none;
                        border: none;
                    "
                    col="${cell.column}"
                    row="${cell.row}"
                    value="${cell.text}"
            >${cell.text}</button>
        `);
    }


}

function fixCellsPosition(animate) {

    $('button').each((i, item) => {

        const col = item.getAttribute('col');
        const row = item.getAttribute('row');

        if (animate) {

            $(item).animate({
                top: row * 60 + 'px',
                left: col * 60 + 'px'
            }, 100);

        } else {
            item.style.top = row * 60 + 'px';
            item.style.left = col * 60 + 'px';
        }
    })
}

function getEmptyNearCell(cell) {

    const board = $('button').map((i, e) => ({
        row: e.getAttribute('row'),
        column: e.getAttribute('col'),
        text: e.getAttribute('value'),
        element: e
    }));

    for (let i = 0; i < 4; i++) {

        for (let j = 0; j < 4; j++) {

            const compared = board[i * 4 + j];

            const dist = Math.abs(cell.row - compared.row) + Math.abs(cell.column - compared.column);

            if (dist === 1 && compared.text === "16") {
                return compared;
            }
        }
    }
}

function didFinish() {
    const one = $('[row=0][col=0]')[0];
    const two = $('[row=0][col=1]')[0];

    const v1 = one.getAttribute('value');
    const v2 = two.getAttribute('value');

    return v1 === '1' && v2 === '2';
}

function removeAllElements() {
    $('button').remove();
}

function restartGame() {

    removeAllElements();

    prepareBoard();
    fixCellsPosition(false);

    $("button").on('click', function (e) {

        const element = e.target;

        const cell = {
            row: element.getAttribute('row'),
            column: element.getAttribute('col'),
            text: element.getAttribute('value'),
            element
        };

        const empty = getEmptyNearCell(cell)

        if (empty) {
            cell.element.setAttribute('row', empty.row);
            cell.element.setAttribute('col', empty.column);

            empty.element.setAttribute('row', cell.row);
            empty.element.setAttribute('col', cell.column);

            fixCellsPosition(true);

            if (didFinish()) {

                const result = confirm("game is completed, start new one?");

                if (result) {
                    restartGame();
                }
            }
        }

    });
}

$(document).ready(() => {

    $('x-restart').on('click', (e) => {

        if (e.target === e.currentTarget) {
            restartGame();
        }
        
    });

    restartGame();
});
