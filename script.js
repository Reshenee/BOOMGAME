let board = [];
let bombPositions = [];
let bet = 100;
let balance = 1000;
let currentWin = 0;
let gameStarted = false;
let mod = 1.1;
let bombs = 10;

let bombSound = new Audio('boom.mp3');
let winSound = new Audio('earn.mp3');

function generateBombs() {
    bombPositions = [];
    const bombCount = parseInt($('#bomb-input').val()) || 10;
    bombs = bombCount;

    mod = 1 + (bombCount * 0.1);

    while (bombPositions.length < bombCount) {
        const randomPosition = Math.floor(Math.random() * 36);
        if (!bombPositions.includes(randomPosition)) {
            bombPositions.push(randomPosition);
        }
    }
}

function createBoard() {
    $('.board').empty();
    board = [];
    for (let i = 0; i < 36; i++) {
        const $cell = $('<div></div>')
            .addClass('cell')
            .data('index', i)
            .on('click', function () {
                if (gameStarted) {
                    const cellIndex = $(this).data('index');
                    if (bombPositions.includes(cellIndex)) {
                        $(this).css('background-image', 'url(bomb.png)');
                        bombSound.play();
                        alert("BOMBA! Przegrałeś.");
                        balance -= bet;
                        updateBalanceDisplay();
                        gameStarted = false;
                        $('#start-button').prop('disabled', false);
                        $('#bet-input').prop('disabled', false);
                        $('#bomb-input').prop('disabled', false);
                        $('#collect-button').prop('disabled', true);
                    } else {
                        winSound.play();
                        currentWin *= mod;
                        $(this).css('background-image', 'url(money.png)');
                        $('#collect-button').prop('disabled', false);
                    }
                }
            });

        board.push($cell);
        $('.board').append($cell);
    }
}

function updateBalanceDisplay() {
    $('#Balance').text('Money: ' + balance);
}

$('#start-button').on('click', function () {
    bet = parseFloat($('#bet-input').val()) || 100;

    if (isNaN(bet) || bet <= 0) {
        alert("Wpisz Poprawną Stawkę.");
        return;
    }

    if (bet > balance) {
        alert("Stawka Jest Większa, Niż Balans.");
        return;
    }

    const bombCount = parseInt($('#bomb-input').val()) || 10;
    if (bombCount < 1 || bombCount > 35) {
        alert("Ilość Bomb Powinna Wynosić 1 - 35.");
        return;
    }

    currentWin = bet;
    gameStarted = true;
    $('#collect-button').prop('disabled', true);
    $('#start-button').prop('disabled', true);
    $('#bet-input').prop('disabled', true);
    $('#bomb-input').prop('disabled', true);

    generateBombs();
    createBoard();
});

$('#collect-button').on('click', function () {
    balance += Math.ceil(currentWin);
    updateBalanceDisplay();
    alert("Gratulacje! Wygrałeś: " + Math.ceil(currentWin));
    gameStarted = false;
    $('#collect-button').prop('disabled', true);
    $('#start-button').prop('disabled', false);
    $('#bet-input').prop('disabled', false);
    $('#bomb-input').prop('disabled', false);
});

updateBalanceDisplay();
