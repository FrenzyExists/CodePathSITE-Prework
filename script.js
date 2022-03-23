/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

console.log("Welcome to my version of Light and Sound, hope you like it!");

//Global Variables
let pattern = [];
let progress = 0; // using an int as we will use an iterator to check the thing
const clueHoldTime = 1000; //how long to hold each clue's light/sound
const block_list = ['./assets/blue_block.svg', './assets/orange_block.svg', './assets/yellow_block.svg', './assets/red_block.svg'];
let strikes = 3; // number of strikes, if it reaches 0 its game over
let volume = 0.5;
let tonePlaying = false;
let gamePlaying = false;


const difficulty = (level) => {
    pattern = []; // clear from mem
    if (level === true) { // normal difficulty
        for (i = 0; i < 8; i++) {
            pattern.push(1 + Math.floor(Math.random() * 4));
        }
    } else { // hard difficulty
        for (i = 0; i < 14; i++) {
            pattern.push(1 + Math.floor(Math.random() * 4));
        }
    }
}

const gen = (num_of_cards) => {
    let box = document.getElementById('card-box');
    for (i = 1; i < num_of_cards + 1; i++) {
        let card_wrapper = document.createElement('div');
        card_wrapper.id = i;
        let img = document.createElement('img');
        img.src = block_list[i - 1];
        card_wrapper.appendChild(img);
        card_wrapper.addEventListener('click', () => {
            guess(card_wrapper)
        });
        box.appendChild(card_wrapper);
    }
}

const start_game = () => {
    // Reset vars
    progress = 0;
    gamePlaying = true;
}

const end_game = () => {
    gamePlaying = false;
}

const play_clue_sequence = () => {
    context.resume()
    let delay = nextClueWaitTime; //set delay to initial wait time
    for (let i = 0; i <= progress; i++) { // for each clue that is revealed so far
        console.log("play single clue: " + pattern[i] + " in " + delay + "ms");
        setTimeout(playSingleClue, delay, pattern[i]) // set a timeout to play that clue
        delay += clueHoldTime;
        delay += cluePauseTime;
    }
}

const guess = (btn) => {
    console.log(btn.id);
}

const main = () => {
    var context = new AudioContext();

    gen(4);
}

main()