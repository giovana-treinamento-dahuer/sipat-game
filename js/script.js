const mario = document.querySelector('.mario');
const pipeimage = ["../images/pipe.png", "../images/box1.png"];
const player = document.querySelector('.player');
const timer = document.querySelector('.timer');
const clouds = document.querySelector('.clouds');
const coinsImage = ["../images/bota.png", "../images/capacete.png", "../images/extintor.png"];
let coins = [];
let pipes = [];
let gameActive = true;
let pipeCreationInterval = 3000;
let coinCreationInterval = 3000;
let lives = 3;
let isColliding = false;
let initialSpeed = 1;
let incrementSpeed = 0.1;
let currentScore = 0;

const jump = () => {
    mario.classList.add('jump');
    setTimeout(() => {
        mario.classList.remove('jump');
        touchscreen.classList.remove('jump');
    }, 500);
}

const press = () => {
    jump()
}

function createRandomElement() {
    const randomNumber = Math.random();

    if (randomNumber < 0.6) {
        createPipe();
        pipeCreationInterval -= 100;
    } else {
        createCoin();
        coinCreationInterval -= 100;
    }
}

function createCoin() {
    let newCoin = document.createElement('img');
    let coinSprite = coinsImage[Math.floor(Math.random() * coinsImage.length)];
    newCoin.src = coinSprite;
    newCoin.classList.add('coin'); // Classe para a moeda
    newCoin.classList.add('coinsTransition'); // Classe para transição (opcional)

    // Define uma posição horizontal fixa e uma posição vertical aleatória dentro do .game-board
    let fixedX = 900; // Posição horizontal fixa
    let gameBoardHeight = document.querySelector('.game-board').clientHeight; // Altura do .game-board
    let randomY = Math.floor(Math.random() * (gameBoardHeight - 80)); // Posição vertical aleatória
    newCoin.style.left = fixedX + 'px'; // Define a posição horizontal
    newCoin.style.top = randomY + 'px'; // Define a posição vertical

    document.querySelector('.game-board').appendChild(newCoin);
    coins.push(newCoin); // Adiciona a nova moeda à matriz de moedas
}

function moveCoin(coin) {
    let speed = initialSpeed;
    let moveCoinInterval = setInterval(() => {
        let marioPosition = parseInt(window.getComputedStyle(mario).getPropertyValue('left'));
        let coinPosition = parseInt(window.getComputedStyle(coin).getPropertyValue('left'));

        if (coinPosition > marioPosition) {
            coin.style.left = `${coinPosition - speed}px`;
        } else {
            coin.remove();
            clearInterval(moveCoinInterval);
            coins.splice(coins.indexOf(coin), 1);
        }
    }, 0.5);

    initialSpeed += incrementSpeed;
}

setInterval(() => {
    coins.forEach(coin => {
        moveCoin(coin);
    });
}, 1000);

function createPipe() {
    let newPipe = document.createElement('img');
    let pipeSprite = pipeimage[Math.floor(Math.random() * pipeimage.length)];
    newPipe.src = pipeSprite;
    newPipe.classList.add('pipe');
    newPipe.classList.add('pipeTransition');

    if (pipeSprite === '../images/pipe.png') {
        newPipe.style.width = '18vw';
        newPipe.style.height = '18vw';
    } else if (pipeSprite === '../images/box1.png') {
        newPipe.style.width = '12vw';
        newPipe.style.height = '12vw';
    }

    newPipe.style.left = '1100px';
    document.querySelector('.game-board').appendChild(newPipe);
    pipes.push(newPipe);
    movePipe(newPipe);
}

function movePipe(pipe) {
    let speed = initialSpeed;
    let movePipeInterval = setInterval(() => {
        let marioPosition = parseInt(window.getComputedStyle(mario).getPropertyValue('left'));
        let pipePosition = parseInt(window.getComputedStyle(pipe).getPropertyValue('left'));

        if (pipePosition > marioPosition) {
            pipe.style.left = `${pipePosition - speed}px`;
        } else {
            pipe.remove();
            clearInterval(movePipeInterval);
            pipes.splice(pipes.indexOf(pipe), 1);
        }
    }, 0.5);

    initialSpeed += incrementSpeed;
}

setInterval(() => {
    pipes.forEach(pipe => {
        movePipe(pipe);
    });
}, 1000);

function updateLives() {
    document.querySelector('.lives-count').textContent = lives;
}

function decreaseLife() {
    if (!isColliding) {
        lives--;
        updateLives();
        isColliding = true;
        if (lives <= 0) {
            endGame();
        }
    }
}

function endGame() {
    gameActive = false;
    document.querySelector('.clouds').classList.add('clouds-stop');
    clearInterval(this.loop)
    clearInterval(loop);
    clearInterval(pipeCreationInterval);
    clearInterval(coinCreationInterval);
    clearInterval(cloudsMovementInterval);
    checkEndGame();
}

function checkCollision() {
    const marioRect = mario.getBoundingClientRect();
    let collided = false;

    pipes.forEach(pipe => {
        const pipeRect = pipe.getBoundingClientRect();

        const tubeCollisionArea = {
            top: pipeRect.top,
            left: pipeRect.left,
            right: pipeRect.left + 100,
            bottom: pipeRect.top + 100
        };

        if (
            marioRect.bottom >= tubeCollisionArea.top &&
            marioRect.left <= tubeCollisionArea.right &&
            marioRect.right >= tubeCollisionArea.left &&
            marioRect.top <= tubeCollisionArea.bottom
        ) {
            collided = true;
        }
    });

    if (collided) {
        decreaseLife();
    } else {
        isColliding = false;
    }
}

function checkCoinCollision() {
    const marioRect = mario.getBoundingClientRect();
    coins.forEach(coin => {
        const coinRect = coin.getBoundingClientRect();

        if (
            marioRect.bottom >= coinRect.top &&
            marioRect.top <= coinRect.bottom &&
            marioRect.right >= coinRect.left &&
            marioRect.left <= coinRect.right
        ) {
            coin.remove();
            coins.splice(coins.indexOf(coin), 1);
            addScore(300);
        }
    });
}

const loop = setInterval(() => {
    if (!gameActive) return;

    checkCollision();
    checkCoinCollision();

    if (gameActive) {
        cloudsMovementInterval = setInterval(() => {
        }, 5000);
    }
}, 30);

const startTimer = () => {
    this.loop = setInterval(() => {
        currentScore +=100;
        timer.innerHTML = currentScore;
    }, 3500);
}

function addScore(points) {
    currentScore += points;
    timer.innerHTML = currentScore;
}

const startGame = () => {
    gameActive = true;
    pipeCreationInterval = 3000;
    coinCreationInterval = 3000;

    setInterval(() => {
        if (!gameActive) return;

        const randomNumber = Math.random();

        if (randomNumber < 0.6) {
            createPipe();
            pipeCreationInterval -= 100;
        } else {
            createCoin();
            coinCreationInterval -= 100;
        }
    }, Math.max(pipeCreationInterval, coinCreationInterval));
}

window.onload = () => {
    player.innerHTML = localStorage.getItem('player');
    startTimer();
    startGame();
}

const firebaseConfig = {
    apiKey: "AIzaSyBa24iKCQT-U6TqYgq2uQhM0igevoTqXdw",
    authDomain: "jogo-sipat.firebaseapp.com",
    databaseURL: "https://jogo-sipat-default-rtdb.firebaseio.com",
    projectId: "jogo-sipat",
    storageBucket: "jogo-sipat.appspot.com",
    messagingSenderId: "1035360107355",
    appId: "1:1035360107355:web:6945c177f889a1e123b87e",
    measurementId: "G-1G22WEY5J0"
};

firebase.initializeApp(firebaseConfig);

const scoresRef = firebase.database().ref('scores');
scoresRef.once('value', snapshot => {
    if (!snapshot.exists()) {
        scoresRef.set(true);
    }
});

function sendDataToFirebase(player, score) {
    const scoresRef = firebase.database().ref('scores');
    scoresRef.push({
        player: player,
        score: score
    }).then(() => {
        console.log("Data sent to Firebase!");
    }).catch(error => {
        console.error("Error sending data to Firebase: ", error);
        swal("Oops!", "Erro ao enviar dados para o Firebase.", "error");
    });
}

const checkEndGame = () => {
    pipes.forEach(pipe => {
    pipe.classList.remove('pipeTransition');
    mario.src = "../images/quedanimacao.gif";
    mario.style.width = "20vw";
    mario.style.height = "20vw";

    setTimeout(() => {
        mario.src = "../images/animacao2.gif";
    }, 300);
});

    if (pipes.length > 0) {
        clearInterval(loop);
    }

    const scoresRef = firebase.database().ref('scores');
    scoresRef.once('value')
        .then(snapshot => {
            let scoresList = [];
            snapshot.forEach(childSnapshot => {
                const scoreData = childSnapshot.val();
                scoresList.push(scoreData.score);
            });

            scoresList.sort((a, b) => b - a);

            const maxScore = scoresList.length > 0 ? scoresList[0] : 0;

            setTimeout(() => {
                swal({
                    title: "Game Over",
                    text: "Deseja tentar mais uma vez?",
                    //icon: "../images/animacao2.gif",
                    buttons: true,
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    content: {
                        element: "p",
                        attributes: {
                            innerHTML: `<p>Sua pontuação atual é: ${currentScore}.<br/><br/>A pontuação mais alta é: ${maxScore}.</p>`
                        }
                    },
                }).then((willDelete) => {
                    if (willDelete) {
                        window.location = '../pages/game.html';
                    } else {
                        window.location = '../index.html';
                    }
                });
            }, 200);
        })
        .catch(error => {
            console.error("Error fetching max score from Firebase: ", error);
            setTimeout(() => {
                swal({
                    title: "Game Over",
                    text: "Deseja tentar mais uma vez?",
                    icon: "../images/quedanimacao.gif",
                    buttons: true,
                    closeOnClickOutside: false,
                    closeOnEsc: false,
                    customClass: {
                        container: 'custom-swal-container',
                        title: 'custom-swal-title',
                        content: 'custom-swal-content',
                        confirmButton: 'custom-swal-button',
                        cancelButton: 'custom-swal-button'
                    },
                }).then((willDelete) => {
                    if (willDelete) {
                        window.location = '../pages/game.html';
                    } else {
                        window.location = '../index.html';
                    }
                });
            }, 200);
        });

        const player = document.querySelector('.player').innerText;
        const score = document.querySelector('.timer').innerText;

        sendDataToFirebase(player, score);
}

function jumpOnScreenClick() {
    jump();
}

document.addEventListener('keydown', jump);
document.addEventListener('click', jumpOnScreenClick);
