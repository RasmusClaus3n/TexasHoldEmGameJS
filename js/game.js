import Player from '../classes/Player.js';
import BettingManager from '../classes/BettingManager.js';
import PlayerTurnQueue from '../classes/PlayerTurnQueue.js';
import GameStateManager from '../classes/GameStateManager.js';

import {
  createDeck,
  createFlop,
  createTurnOrRiver,
  setMainPlayerHoleCards,
  setCpuHoleCards,
  shuffleDeck,
} from './deck-manager.js';
import { setHandRanks } from './score-hand.js';
import { rankHandRanks } from './determine-winner.js';
import { displayToDOM, updateUI } from './dom-handler.js';
import { setBlinds } from './blinds.js';

const callCheckBtn = document.getElementById('check-call');
const betRaiseBtn = document.getElementById('bet-raise');
const foldBtn = document.getElementById('fold');
const confirmRaiseBtn = document.getElementById('confirm-raise-btn');

const randomNames = [
  'Steve',
  'Rey',
  'Glen',
  'Rey',
  'Rick',
  'Raul',
  'Paul',
  'Josh',
  'Bob',
  'Will',
  'Jerry',
  'Scott',
  'Shaun',
  'Dean',
  'Mike',
  'Max',
  'Tim',
  'Karl',
  'Todd',
  'Mary',
  'Lucy',
  'Eve',
  'Jean',
  'Tess',
  'Leah',
  'May',
  'Anne',
  'Gwen',
  'Sally',
  'Rose',
  'Paige',
  'Ruth',
  'Jill',
  'Alice',
  'Edith',
  'Sarah',
  'Carol',
  'Erin',
  'Judy',
];

let cpuPlayers;
let mainPlayer;
let winner;

if (!cpuPlayers || !mainPlayer) {
  cpuPlayers = createCPUplayers();
  mainPlayer = createMainPlayer();
}

const allPlayers = [mainPlayer, ...cpuPlayers];

startGame(mainPlayer, cpuPlayers, allPlayers);

function startGame(mainPlayer, cpuPlayers, allPlayers) {
  const bm = new BettingManager();
  const ptq = new PlayerTurnQueue();
  const gsm = new GameStateManager();

  addPlayersToGSM(gsm, mainPlayer, cpuPlayers);

  ptq.enqueue(mainPlayer);
  cpuPlayers.forEach((player) => ptq.enqueue(player));

  const deck = createDeck([]);
  const comCards = [];

  shuffleDeck(deck);
  setMainPlayerHoleCards(mainPlayer, deck);
  setCpuHoleCards(cpuPlayers, deck);

  // startNewStage(comCards, deck);

  setHandRanks(mainPlayer, cpuPlayers, comCards);
  displayToDOM(mainPlayer, cpuPlayers, comCards);

  setBlinds(allPlayers, bm);

  startMainPlayerTurn(mainPlayer, ptq, bm);

  updateUI(mainPlayer, cpuPlayers, bm.getPot());

  winner = rankHandRanks(mainPlayer, cpuPlayers);
  logWinner(winner);
}

function startNewStage(comCards, deck) {
  let isFlop = false;
  let isTurn = false;
  let isRiver = false;

  if (comCards.length === 0) {
    isFlop = true;
    createFlop(deck, comCards);
  } else if (comCards.length === 3) {
    isFlop = false;
    createTurnOrRiver(deck, comCards);
  }
}

function setActivePlayersToPtq(mainPlayer, cpuPlayers) {}

function startMainPlayerTurn(mainPlayer, ptq, bm) {
  updatePlayerOptionsUI(bm);
  initiateMainPlayerRaise(bm);
}

function initiateMainPlayerRaise(bm) {
  const mainPlayerMoney = mainPlayer.getMoney();

  // Set min and max for the slider
  const slider = document.getElementById('slider');
  slider.min = bm.getCurrentBet() + 1;
  slider.max = mainPlayerMoney;
  slider.value = slider.min; // Set default value to the minimum possible value

  // Update the textContent of the paragraph with the slider value
  const raiseMoneyText = document.querySelector('.raise-money');
  raiseMoneyText.textContent = `$${slider.min}`;

  // Add event listener to update textContent when slider value changes
  slider.addEventListener('input', function () {
    if (parseInt(this.value) === parseInt(this.max)) {
      raiseMoneyText.textContent = 'All in, baby!';
    } else {
      raiseMoneyText.textContent = `$${this.value}`;
    }
  });

  // Add an event listener to the "Confirm" button
  confirmRaiseBtn.addEventListener('click', function () {
    const slider = document.getElementById('slider');
    const raiseAmount = parseInt(slider.value);

    if (raiseAmount >= mainPlayer.getMoney()) {
      // If the raise is equal to or more than the main player's money, it's an "All In"
      bm.addToPot(mainPlayer.getMoney());
      mainPlayer.setMoney(0);
      bm.setCurrentBet(mainPlayer.getMoney());
    } else {
      bm.addToPot(raiseAmount);
      mainPlayer.setMoney(mainPlayer.getMoney() - raiseAmount);
      bm.setCurrentBet(raiseAmount);
    }

    // Reset the slider value and text
    slider.value = slider.min;
    const raiseMoneyText = document.querySelector('.raise-money');
    raiseMoneyText.textContent = `$${slider.min}`;

    // Update the UI
    updateUI(mainPlayer, null, bm.getPot());

    ptq.dequeue(mainPlayer);

    startCpuPlayersTurn();
  });
}

function startCpuPlayersTurn() {}

function createCPUplayers() {
  let cpuPlayers = [];

  for (let i = 0; i < 5; i++) {
    let cpu = new Player();

    cpu.setMoney(1000);

    // Generate a random index to select a name
    const randomIndex = Math.floor(Math.random() * randomNames.length);
    const randomName = randomNames[randomIndex];

    // Set the name and remove it from the copy
    cpu.setName(randomName);
    randomNames.splice(randomIndex, 1);

    cpuPlayers.push(cpu);
  }

  return cpuPlayers;
}

function createMainPlayer() {
  let mainPlayer = new Player();
  mainPlayer.setMoney(1000);
  mainPlayer.setName('You');

  return mainPlayer;
}

function logWinner(winner) {
  console.log(winner);

  if (Array.isArray(winner)) {
    console.log('Tied winners!: ');
    for (const player of winner) {
      console.log(player.getName());
    }
  } else {
    console.log(winner.getName() + ' wins');
    // winner.setMoney(winner.getMoney() + pot);
  }
}

function updatePlayerOptionsUI(bm) {
  if (bm.getCurrentBet() === 0) {
    callCheckBtn.textContent = 'Check';
    betRaiseBtn.textContent = 'Bet';
    foldBtn.classList.add('hidden');
  } else {
    callCheckBtn.textContent = 'Call';
    betRaiseBtn.textContent = 'Raise';
    foldBtn.classList.remove('hidden');
  }
}

function addPlayersToGSM(gsm, mainPlayer, cpuPlayers) {
  gsm.addMainPlayer(mainPlayer);
  cpuPlayers.forEach((cpuPlayer) => {
    gsm.addCpuPlayer(mainPlayer);
  });
}

foldBtn.addEventListener('click', function (ptq) {
  ptq.dequeue(mainPlayer);
});

export { mainPlayer, cpuPlayers, allPlayers };
