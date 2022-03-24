/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

console.log("Welcome to my version of Light and Sound, hope you like it!");

//Global Variables
let pattern = [];
let progress = 0; // using an int as we will use an iterator to check the thing
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const cluePauseTime = 333; //how long to pause in between clues
const nextClueWaitTime = 1000; //how long to wait before starting playback of the clue sequence
const blockList = ['./assets/blue_block.svg', './assets/orange_block.svg', './assets/yellow_block.svg', './assets/red_block.svg', './assets/green_block.svg'];
let guessCounter = 0;
let strikes = 0; // number of strikes, if it reaches 0 its game over
let volume = 0.3; // default is 0.5, set to 0.3 if ears are bleeding
let tonePlaying = false;
let difficultyBool = true;
let gamePlaying = false;
let freqMap = {};
freqMap['game'] = 450.76
freqMap['diff'] = 520.76
const generateFrequencyMap = (mapLength, start, dx) => {
    for (i = 0; i < mapLength; i++) {
        freqMap[i + 1] = start + i * dx;
    }
}


// Init Sound Synthesizer
let AudioContext = window.AudioContext || window.webkitAudioContext
let context = new AudioContext()
let o = context.createOscillator()
let g = context.createGain()

// Sound Management functions

const playTone = (btn, len) => {
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
    context.resume()
    tonePlaying = true
    setTimeout(function() {
        stopTone()
    }, len)
}

const startTone = (btn) => {
    if (!tonePlaying) {
        context.resume()
        o.frequency.value = freqMap[btn]
        g.gain.setTargetAtTime(volume, context.currentTime + 0.05, 0.025)
        context.resume()
        tonePlaying = true
    }
}

const stopTone = () => {
    g.gain.setTargetAtTime(0, context.currentTime + 0.05, 0.025)
    tonePlaying = false
}

const lightButton = (btn) => {
    document.getElementById(btn).classList.add('lit')
}

const clearButton = (btn) => {
    document.getElementById(btn).classList.remove("lit")
}

function playSingleClue(btn) {
    if (gamePlaying) {
        lightButton(btn);
        playTone(btn, clueHoldTime);
        setTimeout(clearButton, clueHoldTime, btn);
    }
}

const enableButtons = (button_container_id) => {
    Array.from(document.getElementById(button_container_id).childNodes).forEach((i) => {
        i.classList.remove('playing-sequence')
    });
}

const disableButtons = (button_container_id) => {
    Array.from(document.getElementById(button_container_id).childNodes).forEach((i) => {
        i.classList.add('playing-sequence')
    });
}

const playClueSequence = () => {
    context.resume()
    disableButtons('card-box');
    let delay = nextClueWaitTime; //set delay to initial wait time
    for (let i = 0; i <= progress; i++) { // for each clue that is revealed so far
        console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
        setTimeout(playSingleClue, delay, pattern[i]) // set a timeout to play that clue
        delay += clueHoldTime;
        delay += cluePauseTime;
    }
    setTimeout(enableButtons, delay, 'card-box') // Make sure that Player can't mess up the game when the sequence is playing due to impatience
}

const changeDifficulty = (btn) => {
    console.log(btn.innerText)
    playTone('diff', clueHoldTime / 10);
    console.log(document.getElementById('game-btn').childNodes[3].childNodes[3].innerText)
    if (document.getElementById('game-btn').childNodes[3].childNodes[3].innerText === 'Stop') {
        document.getElementById('game-btn').childNodes[3].childNodes[3].innerText = 'Start'
        stopGame();
    }
    if (btn.innerText === "Normal") {
        difficultyBool = false;
        btn.innerText = "Hard"
    } else if (btn.innerText === "Hard") {
        difficultyBool = true;
        btn.innerText = "Normal"
    }
}

const difficulty = (level) => {
    pattern = []; // clear from mem
    if (level === true) { // normal difficulty
        for (i = 0; i < 8; i++) {
            pattern.push(1 + Math.floor(Math.random() * blockList.length));
        }
    } else { // hard difficulty
        for (i = 0; i < 14; i++) {
            pattern.push(1 + Math.floor(Math.random() * blockList.length));
        }
    }
}

const generateBlocks = (num_of_cards, blockList) => {
    let box = document.getElementById('card-box');
    for (i = 1; i < num_of_cards + 1; i++) {
        let card_wrapper = document.createElement('div');
        card_wrapper.id = i;
        let img = document.createElement('img');
        img.src = blockList[i - 1];
        card_wrapper.appendChild(img);
        card_wrapper.addEventListener('click', () => {
            guess(card_wrapper.id)
        });
        img.addEventListener('mousedown', () => {
            startTone(card_wrapper.id);
        });
        img.addEventListener('mouseup', () => {
            stopTone();
        });
        // Disable drag to prevent bug
        img.ondragstart = () => {
            return false
        }
        box.appendChild(card_wrapper);
    }
}

const startGame = () => {
    //initialize game variables
    progress = 0;
    guessCounter = 0;
    strikes = 0;
    gamePlaying = true;
    difficulty(difficultyBool); // Setting normal difficulty as default
    enableButtons('card-box');
    playClueSequence()
}

const stopGame = () => {
    //initialize game variables
    gamePlaying = false;


}

const loseGame = () => {
    GameButtonEvents(document.getElementById('game-btn'))
    setTimeout(() => { // Fix minor timing issue for more smoothness
        alert("Oh, you lost. But don't be sad! You can try again");
    }, 500);

}

const winGame = () => {
    stopGame();
    alert("You Win!");
}

// Use one single button instead of two
const GameButtonEvents = (btn) => {
    playTone('game', clueHoldTime / 10); // Nice sound for playing button
    if (btn.childNodes[3].childNodes[3].innerText === 'Start') {
        btn.childNodes[3].childNodes[3].innerText = 'Stop';
        startGame();
    } else {
        btn.childNodes[3].childNodes[3].innerText = 'Start';
        stopGame();
    }
}


const guess = (btn) => {
    if (!gamePlaying) {
        return;
    }
    console.log("Current Progress: " + progress);
    console.log("guessCounter Progress: " + guessCounter);
    console.log("Player guessed: " + btn);
    if (pattern[guessCounter] == btn) {
        if (guessCounter == progress) {
            if (progress == pattern.length - 1) {
                winGame();
            } else {
                progress++;
                guessCounter = 0;
                playClueSequence()
            }
        } else {
            guessCounter++;
        }
    } else {
        console.log("Strike " + (strikes + 1) + "!");
        if (strikes == 2) {
            loseGame();
        } else {
            strikes++;
            playClueSequence()
        }
        guessCounter = 0;

    }
}


// Page Initialization
const main = () => {
    // Init Sound Synthesizer
    g.connect(context.destination)
    g.gain.setValueAtTime(0, context.currentTime)
    o.connect(g)
    o.start(0)
    generateFrequencyMap(blockList.length, 191, 46.75); // Yield frequencies
    generateBlocks(blockList.length, blockList); // Create blocks dinamically
}

// Trigger Function
main();