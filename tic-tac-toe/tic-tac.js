let cells = document.getElementsByClassName('cell');
let msg = document.querySelector('.msg');
let reset = document.querySelector('.reset');
let pc = document.querySelector('#pc');
let turn = 'X';
let winner = 'draw';
let gameOver = false;
let pcIsPlaying = false;
msg.classList.remove('show');



for (const cell of cells) {
    // while(!gameOver){}
    cell.addEventListener('click', () => {

        pcIsPlaying = pc.checked ? true : false;

        if (cell.textContent == '') {
            cell.textContent = turn;
            // console.log('pc is playing :', pcIsPlaying);
            if (pcIsPlaying) {
                setTimeout(pcPlay, 500);
                setInterval(checkWinner, 500)
            } else {
                turn = turn === 'X' ? 'O' : 'X';
                checkWinner()
            }
        }
    })
}

let winPattern = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function checkWinner() {
    for (const comb of winPattern) {
        const cell1 = cells[comb[0]];
        const cell2 = cells[comb[1]];
        const cell3 = cells[comb[2]];

        if (
            cell1.textContent === cell2.textContent &&
            cell2.textContent === cell3.textContent &&
            cell1.textContent !== ""
        ) {
            gameOver = true;
            winner = cell1.textContent;
            // console.log(winner);
            msg.textContent = `${winner} wins !`;
            msg.classList.add('show');
            break;
        }
    }

    if (full() && winner == 'draw') {
        console.log('Match draw!');
        msg.textContent = `Game over. It's a ${winner}!`;
        msg.classList.add('show');
        gameOver = true
    }
}

function full() {
    for (const el of cells) {
        // console.log(el);
        if (el.textContent == '' || el.textContent == undefined) {
            return false
        }
    }
    return true;
}

reset.addEventListener('click', () => {
    msg.textContent = '';
    msg.classList.remove('show');
    turn = 'X';
    gameOver = false;
    winner = 'draw';
    for (const el of cells) {
        el.textContent = '';
    }
})

function pcPlay() {
    if (full()) {
        return
    }
    turn = turn === 'X' ? 'O' : 'X';

    let pos = Math.floor(Math.random() * 9);

    while (cells[pos].textContent != '') {
        pos = Math.floor(Math.random() * 9);
    }

    let arr = [];
    for (const c of cells) {
        arr.push(c.textContent)
    }

    let opp = turn === 'X' ? 'O' : 'X';
    let consider = false;


    console.log(arr);
    for (const item of winPattern) {
        if (arr[item[0]] == '' || arr[item[1]] == '' || arr[item[2]] == '') {
            if (
                arr[item[0]] == turn && arr[item[1]] == turn ||
                arr[item[0]] == turn && arr[item[2]] == turn ||
                arr[item[1]] == turn && arr[item[2]] == turn
            ) {
                for (let i = 0; i < 3; i++) {
                    if (arr[item[i]] == '') {
                        if (!consider) {
                            cells[item[i]].textContent = turn;
                            consider = true;
                        }
                        break
                    }
                }
                console.log('first');
                break;
            }
        }
    }

    for (const item of winPattern) {
        if (arr[item[0]] == '' || arr[item[1]] == '' || arr[item[2]] == '') {
            if (
                arr[item[0]] == opp && arr[item[1]] == opp ||
                arr[item[0]] == opp && arr[item[2]] == opp ||
                arr[item[1]] == opp && arr[item[2]] == opp
            ) {
                for (let i = 0; i < 3; i++) {
                    if (arr[item[i]] == '') {
                        if (!consider) {
                            cells[item[i]].textContent = turn;
                            consider = true;
                        }
                        break
                    }
                }
                console.log('second');
                break;
            }
        }
    }

    if (consider == false) {
        cells[pos].textContent = turn;
    }
    
    turn = turn === 'X' ? 'O' : 'X';
}