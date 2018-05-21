
const API_BASE_URL = "http://localhost:2767/Handler.ashx"
let prevCell = null;

function getNewBoard2() {
    return fetch(`${API_BASE_URL}?cmd=Shuffle&numbers=16`)
            .then(res => res.json())
}

async function prepareBoard2() {

    const board = await getNewBoard2();

    for (let i in board) {
        const cell = board[i];

        const { text, color } = cell;
        const visible = text !== "16";
        const [r,g,b] = color;

        const row = Math.floor(i / 4) + 1;
        const column = i % 4;

        $("x-game").append(`
            <button style="
                        background-color: rgb(${r},${g},${b});
                        color: ${!visible ? 'transparent' : 'black'};
                        position: absolute;
                        width: 50px;
                        height: 50px;
                        display: ${visible ? 'block' : 'none'};
                    "
                    col="${column}"
                    row="${row}"
                    color="${`[${r},${g},${b}]`}"
                    value="${text}"
            >${text}</button>
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

async function isValidMove(cell, empty) {
    return fetch(`${API_BASE_URL}?cmd=IsValidMove&row=${cell.row}&column=${cell.column}&emptyRow=${empty.row}&emptyColumn=${empty.column}`)
            .then(res => res.json())
}

function getEmptyCell() {

    const emptyCell = $('button')
    .map((i, e) => ({
        row: e.getAttribute('row'),
        column: e.getAttribute('col'),
        text: e.getAttribute('value'),
        element: e
    }))
    .filter((i, item) => item.text === '16')[0];

    return emptyCell;
}

async function updateNewColor(prevCell, newCell) {

    const first = prevCell === null ? {
        text: 0,
        color: [255,255,255]
    } : {
        text: prevCell.text,
        color: JSON.parse(prevCell.color)
    };

    const second = {
        text: newCell.text,
        color: JSON.parse(newCell.color)
    };

    const query = `cmd=GetAverageColor&first=${encodeURIComponent(JSON.stringify(first))}&second=${encodeURIComponent(JSON.stringify(second))}`;

    const result = await fetch(`${API_BASE_URL}?${query}`)
        .then(res => res.json());

    const newColor = result.color;
    const [r,g,b] = newColor;

    $('.ui-page').css('background-color', `rgb(${r},${g},${b})`);
}

function didFinish() {

    const arr = $('button')
    .map((i, e) => ({
        row: e.getAttribute('row'),
        column: e.getAttribute('col'),
        text: e.getAttribute('value'),
        color: e.getAttribute('color'),
        element: e
    }))
    .map((i, e) => ({
        text: e.text,
        color: JSON.parse(e.color)
    }));

    const query = `cmd=CheckGameOver&array=${encodeURIComponent(JSON.stringify(arr.toArray()))}`

    return fetch(`${API_BASE_URL}?${query}`)
            .then(res => res.json())
}

function removeAllElements() {
    $('button').remove();
}

async function restartGame() {

    removeAllElements();

    await prepareBoard2();

    fixCellsPosition(false);

    $("button").on('click', async function (e) {

        const element = e.target;

        const cell = {
            row: element.getAttribute('row'),
            column: element.getAttribute('col'),
            text: element.getAttribute('value'),
            color: element.getAttribute('color'),
            element
        };

        const empty = getEmptyCell();

        if (await isValidMove(cell, empty)) {

            cell.element.setAttribute('row', empty.row);
            cell.element.setAttribute('col', empty.column);

            empty.element.setAttribute('row', cell.row);
            empty.element.setAttribute('col', cell.column);

            await updateNewColor(prevCell, cell);

            fixCellsPosition(true);

            prevCell = cell;

            if (await didFinish()) {

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
