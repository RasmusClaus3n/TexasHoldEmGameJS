import Player from '../classes/Player.js';
import {
  createDeck,
  createHand,
  createFlop,
  createTurnOrRiver,
  createTestFlop,
  createMainPlayerTestHand,
  createCPU1TestHand,
  createCPU2TestHand,
} from './deck-manager.js';
import { scoreCards } from './score-hand.js';
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
let blindTurnNum;
let playerTurnNum;
let lastBet;
let pot;

if (!cpuPlayers || !mainPlayer) {
  cpuPlayers = createCPUplayers();
  mainPlayer = createMainPlayer();
  blindTurnNum = 0;
  pot = 0;
  lastBet = 0;
}

const allPlayers = [mainPlayer, ...cpuPlayers];

startGame(mainPlayer, cpuPlayers, allPlayers, pot, blindTurnNum, lastBet);

function startGame(
  mainPlayer,
  cpuPlayers,
  allPlayers,
  pot,
  playerTurnNum,
  blindTurnNum
) {
  const deck = createDeck([]);
  const comCards = [];

  shuffleDeck(deck);
  setMainPlayerHoleCards(mainPlayer, deck);
  setCpuHoleCards(cpuPlayers, deck);

  startNewStage(comCards, deck);

  setHandRanks(mainPlayer, cpuPlayers, comCards);
  displayToDOM(mainPlayer, cpuPlayers, comCards);
  pot = setBlinds(allPlayers, pot, blindTurnNum);

  setPlayerOptionsUI(lastBet);

  const potAndLastBet = setMoneyToBeRaised(lastBet, pot);
  pot = potAndLastBet.pot;
  lastBet = potAndLastBet.lastBet;

  mainPlayerTurn(mainPlayer);

  updateUI(mainPlayer, cpuPlayers, pot);

  winner = rankHandRanks(mainPlayer, cpuPlayers);
  logWinner(winner);
}

function mainPlayerTurn(mainPlayer) {
  initiateCPUTurns();
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

function startGameCycle(allPlayers) {
  const activePlayers = allPlayers.filter((player) => player.isActive);
  const activeCPUPlayers = activePlayers.filter(
    (player) => player !== mainPlayer
  );

  if (lastBet === 0 && activeCPUPlayers.length > 0) {
    initiateCPUTurns(activeCPUPlayers);
  } else if (lastBet > 0) {
    // Main player's turn is complete, proceed with the next stage or showdown
  }

  setPlayerOptionsUI(lastBet); // Update UI options based on last bet
}

function initiateCPUTurns(activeCPUPlayers) {
  let currentIndex = 0;

  function playNextCPU() {
    const currentPlayer = activeCPUPlayers[currentIndex];
    const callAmount = lastBet; // Call the current bet

    if (callAmount === 0) {
      // Player can check, no need to do anything
      console.log(`${currentPlayer.getName()} checks.`);
    } else {
      // Player needs to call
      console.log(`${currentPlayer.getName()} calls ${callAmount}.`);
      const potAndLastBet = cpuCall(currentPlayer, callAmount, pot);
      pot = potAndLastBet.pot;
      lastBet = potAndLastBet.lastBet;
    }

    currentIndex++;

    if (currentIndex < activeCPUPlayers.length) {
      setTimeout(playNextCPU, 1000); // Set a timeout for next player's turn
    } else {
      // All CPU players have played, proceed with next stage or showdown
    }
  }

  updateUI(mainPlayer, cpuPlayers, pot);
  playNextCPU(); // Start the CPU player turns
}

function cpuCall(cpuPlayer, lastBet, pot) {
  if (cpuPlayer.getMoney() >= lastBet) {
    cpuPlayer.setMoney(cpuPlayer.getMoney() - lastBet);
    pot += lastBet;
  }
  return { pot, lastBet };
}

function setPlayerOptionsUI(lastBet) {
  if (lastBet === 0) {
    callCheckBtn.textContent = 'Check';
    betRaiseBtn.textContent = 'Bet';
    foldBtn.classList.add('hidden');
  } else {
    callCheckBtn.textContent = 'Call';
    betRaiseBtn.textContent = 'Raise';
    foldBtn.classList.remove('hidden');
  }
}

function setMoneyToBeRaised(lastBet, pot) {
  const mainPlayerMoney = mainPlayer.getMoney();

  // Set min and max for the slider
  const slider = document.getElementById('slider');
  slider.min = lastBet + 1;
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
      // If the raise is equal to or more than the main player's money, it's an "All In" w
      pot += mainPlayer.getMoney();
      mainPlayer.setMoney(0);
      lastBet = mainPlayer.getMoney();
    } else {
      pot += raiseAmount;
      mainPlayer.setMoney(mainPlayer.getMoney() - raiseAmount);
      lastBet = raiseAmount;
    }

    // Reset the slider value and text
    slider.value = slider.min;
    const raiseMoneyText = document.querySelector('.raise-money');
    raiseMoneyText.textContent = `$${slider.min}`;

    // Update the UI
    updateUI(mainPlayer, cpuPlayers, pot);
  });
  return { pot, lastBet };
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

function setCpuHoleCards(cpuPlayers, deck) {
  cpuPlayers.forEach((cpu) => {
    let cpuCards = [];
    cpu.setHand(createHand(deck, cpuCards));
  });
}

function setMainPlayerHoleCards(mainPlayer, deck) {
  let mainPlayerCards = [];
  mainPlayer.setHand(createHand(deck, mainPlayerCards));
  // mainPlayer.setHand(createMainPlayerTestHand(deck, mainPlayerCards));
}

function setHandRanks(mainPlayer, cpuPlayers, comCards) {
  mainPlayer.setHandRank(scoreCards(comCards, mainPlayer));
  for (let cpu of cpuPlayers) {
    cpu.setHandRank(scoreCards(comCards, cpu));
  }
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
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

export { mainPlayer, cpuPlayers, allPlayers };
