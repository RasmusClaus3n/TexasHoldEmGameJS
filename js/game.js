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

startGame(mainPlayer, cpuPlayers);

function startGame(mainPlayer, cpuPlayers) {
  const bm = new BettingManager(); // Manages money to pot and remebers last made bet
  const ptq = new PlayerTurnQueue(); // Determines player turn in round and blinds
  const gsm = new GameStateManager(); // Stores players and manages player states

  mainPlayer.setIsMainPlayer(true);

  addPlayersToGSM(gsm, mainPlayer, cpuPlayers);
  setAllPlayersToActive(gsm);
  addActivePlayersToPTQ(gsm, ptq);

  const deck = createDeck([]);
  const comCards = [];

  shuffleDeck(deck);
  setMainPlayerHoleCards(gsm.getMainPlayer(), deck);
  setCpuHoleCards(gsm.getCpuPlayers(), deck);

  startNewStage(comCards, deck);

  setHandRanks(gsm.getMainPlayer(), gsm.getCpuPlayers(), comCards);
  displayToDOM(gsm.getMainPlayer(), gsm.getCpuPlayers(), comCards);

  setBlinds(gsm.getAllPlayers(), bm);

  startMainPlayerTurn(gsm.getMainPlayer(), ptq, bm); // Main player always starts first round

  updateUI(gsm.getMainPlayer(), gsm.getCpuPlayers(), bm.getPot());

  // winner = rankHandRanks(gsm.getMainPlayer(), gsm.getCpuPlayers());
  // logWinner(winner);

  foldBtn.addEventListener('click', function () {
    ptq.dequeue(ptq.getMainPlayer());
    gsm.setActive(gsm.getMainPlayer(), false);
    // TBI
  });
}

function startMainPlayerTurn(mainPlayer, ptq, bm) {
  updatePlayerOptionsUI(bm); // UI changes if player can check/bet or call/raise/fold
  initiateMainPlayerRaise(mainPlayer, ptq, bm); // Sets main player's max and min raise values
}

function initiateMainPlayerRaise(mainPlayer, ptq, bm) {
  const mainPlayerMoney = mainPlayer.getMoney();

  // Set min and max for the raise slider
  const slider = document.getElementById('slider');
  slider.min = bm.getCurrentBet() + 1; // Min money to raise with
  slider.max = mainPlayerMoney; // I.e. all in
  slider.value = slider.min; // Display money to be raised with

  // Update default raiseMoneyText with min slider value
  const raiseMoneyText = document.querySelector('.raise-money');
  raiseMoneyText.textContent = `$${slider.min}`;

  // Updates raiseMoneyText when slider value changes
  slider.addEventListener('input', function () {
    if (parseInt(this.value) === parseInt(this.max)) {
      raiseMoneyText.textContent = 'All in, baby!';
    } else {
      raiseMoneyText.textContent = `$${this.value}`;
    }
  });

  confirmRaiseBtn.addEventListener('click', function () {
    mainPlayer.setHasCalled(true);

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
    ptq.enqueue(mainPlayer);

    determineRound(mainPlayer, ptq, bm);
  });
}

function determineRound(mainPlayer, ptq, bm) {
  if (ptq.allPlayersHaveCalled()) {
    console.log('STOP');
  }

  const currentPlayer = ptq.getCurrentPlayer();

  if (!currentPlayer.getIsMainPlayer()) {
    startNextTurn(currentPlayer, ptq, bm);
  } else {
    console.log('Woops');
  }
}

function startNextTurn(currentPlayer, ptq, bm) {
  if (currentPlayer.getIsMainPlayer(true)) {
    startMainPlayerTurn(ptq.getMainPlayerFromQ(), ptq, bm);
  } else {
    startNextCpuTurn(currentPlayer, ptq, bm);
  }
}

function startNextCpuTurn(currentCpuPlayer, ptq, bm) {
  if (cpuCanCall(currentCpuPlayer, bm, ptq)) {
    cpuCalls(currentCpuPlayer, bm, ptq);
  }
}

function cpuCanCall(currentCpuPlayer, bm) {
  if (currentCpuPlayer.getMoney() >= bm.getCurrentBet()) {
    return true;
  } else {
    return false;
  }
}

function cpuCalls(currentCpuPlayer, bm, ptq) {
  currentCpuPlayer.setHasCalled(true);

  const cpuCallAmount = bm.getCurrentBet(); // Call will always be last made bet

  console.log(currentCpuPlayer.getName() + ' calls with ' + cpuCallAmount);

  currentCpuPlayer.setMoney(currentCpuPlayer.getMoney() - cpuCallAmount);
  bm.addToPot(cpuCallAmount);

  ptq.dequeue(currentCpuPlayer);
  ptq.enqueue(currentCpuPlayer); // To the end of queue

  testFunction(ptq, bm); // This is stupid

  startNextTurn(ptq.getCurrentPlayer(), ptq, bm);
}

function testFunction(ptq, bm) {
  console.log(ptq.getCurrentPlayer());
  updateUI(ptq.getMainPlayerFromQ(), ptq.getCpuPlayersFromQ(), bm.getPot());
}

function setCpuBehaviour() {
  const cpuBehaviours = ['normal', 'safe', 'aggressive'];
  const randomIndex = Math.floor(Math.random() * cpuBehaviours.length);
  const cpuBehaviour = cpuBehaviours[randomIndex];

  return cpuBehaviour;
}

function checkCpuHandStrenght(currentCpuPlayer) {
  const cpuPlayerFirstCard = currentCpuPlayer.getHand()[0].getValue();
  const cpuPlayerSecondCard = currentCpuPlayer.getHand()[1].getValue();
  if (cpuPlayerFirstCard > 10 && cpuPlayerSecondCard > 10) {
    return true;
  } else {
    return false;
  }
}

function cpuRaises(currentCpuPlayer, bm) {
  console.log(currentCpuPlayer.getName() + ' raises');
  if (currentCpuPlayer.getMoney() >= bm.getCurrentBet() * 5) {
    const cpuCallAmount = bm.getCurrentBet() * 5;
    currentCpuPlayer.setMoney(currentCpuPlayer.getMoney() - cpuCallAmount);
    bm.addToPot(cpuCallAmount);
  } else {
    cpuFolds(currentCpuPlayer);
  }
}

function cpuFolds(currentCpuPlayer, ptq) {
  console.log(currentCpuPlayer.getName() + ' folds');
  gsm.setActive(currentCpuPlayer, false);
}

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
    gsm.addCpuPlayer(cpuPlayer);
  });
}

function setAllPlayersToActive(gsm) {
  gsm.setActive(gsm.getMainPlayer(), true);
  gsm.getCpuPlayers().forEach((cpuPlayer) => gsm.setActive(cpuPlayer, true));
}

function addActivePlayersToPTQ(gsm, ptq) {
  const activePlayers = gsm.getActivePlayers();

  activePlayers.forEach((player) => {
    let isAlreadyInQueue = false;

    for (let i = ptq.frontIndex; i < ptq.backIndex; i++) {
      if (ptq.items[i] === player) {
        isAlreadyInQueue = true;
        break;
      }
    }

    if (!isAlreadyInQueue && player.getIsBust() === false) {
      ptq.enqueue(player);
    }
  });
}

function highLightPlayer(player) {
  const playerContainer = document.getElementById(
    player.getName() + '-container'
  );

  playerContainer.classList.add('blinking-border');
}

function stopHightLightPlayer(player) {
  const playerContainer = document.getElementById(
    player.getName() + '-container'
  );
  playerContainer.classList.remove('blinking-border');
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

export { mainPlayer, cpuPlayers, allPlayers };
