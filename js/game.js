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
import {
  displayToDOM,
  updateUI,
  updateComCardsDOM,
  updateMainPlayerHoleCardsDOM,
} from './dom-handler.js';
import { setBlinds } from './blinds.js';

const callCheckBtn = document.getElementById('check-call');
const betRaiseBtn = document.getElementById('bet-raise');
const foldBtn = document.getElementById('fold');
const confirmRaiseBtn = document.getElementById('confirm-raise-btn');

const gsm = new GameStateManager(); // Stores players and manages player states
const bm = new BettingManager(); // Manages money to pot and remebers last made bet
const ptq = new PlayerTurnQueue(); // Determines player turn in round and blinds

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
  mainPlayer.setIsMainPlayer(true);
  setAllPlayersToActive(mainPlayer, cpuPlayers);
  addActivePlayersToPTQ(mainPlayer, cpuPlayers, ptq);

  gsm.deck = createDeck([]);
  shuffleDeck(gsm.deck);

  setMainPlayerHoleCards(ptq.getMainPlayerFromQ(), gsm.deck);
  setCpuHoleCards(ptq.getCpuPlayersFromQ(), gsm.deck);

  setHandRanks(
    ptq.getMainPlayerFromQ(),
    ptq.getCpuPlayersFromQ(),
    gsm.comCards
  );
  displayToDOM(
    ptq.getMainPlayerFromQ(),
    ptq.getCpuPlayersFromQ(),
    gsm.comCards
  );

  setBlinds([ptq.getMainPlayerFromQ(), ...ptq.getCpuPlayersFromQ()], bm);
  updateUI(ptq.getMainPlayerFromQ(), ptq.getCpuPlayersFromQ(), bm.getPot());

  startMainPlayerTurn(ptq.getMainPlayerFromQ(), ptq, bm); // Main player always starts first round

  // winner = rankHandRanks(gsm.getMainPlayer(), gsm.getCpuPlayers());
  // logWinner(winner);

  foldBtn.addEventListener('click', function () {
    ptq.getMainPlayerFromQ().setIsActive(false);
    ptq.dequeue(ptq.getMainPlayerFromQ());
    // TBI
  });
}

function startMainPlayerTurn(mainPlayer) {
  updatePlayerOptionsUI(); // UI changes if player can check/bet or call/raise/fold
  if (mainPlayer.getMoney() > bm.getCurrentBet()) {
    initMainPlayerRaise(mainPlayer); // Sets main player's max and min raise values
  }
}

function initMainPlayerRaise(mainPlayer) {
  const mainPlayerMoney = mainPlayer.getMoney();

  // Set min and max for the raise slider
  const slider = document.getElementById('slider');
  slider.min = bm.getCurrentBet(); // Min money to raise with
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
    mainPlayer.setHasRaised(true);

    const raiseAmount = parseInt(slider.value);

    bm.addToPot(raiseAmount);
    bm.setCurrentBet(raiseAmount);

    mainPlayer.setMoney(mainPlayerMoney - raiseAmount);
    console.log('My money:' + mainPlayer.getMoney());

    addMessage('You raised with: $' + raiseAmount); // Start the process

    // Reset the slider value and text
    slider.value = slider.min;
    const raiseMoneyText = document.querySelector('.raise-money');
    raiseMoneyText.textContent = `$${slider.min}`;

    updateUI(mainPlayer, null, bm.getPot());

    ptq.dequeue(mainPlayer);
    ptq.enqueue(mainPlayer);

    determineRound(ptq, bm);
  });
}

function determineRound() {
  setTimeout(() => {
    const currentPlayer = ptq.getCurrentPlayer();

    if (isNoMoreCalls(ptq)) {
      console.log('No more calls');
      startNextStage(gsm.comCards, gsm.deck);
    } else {
      startNextTurn(currentPlayer);
    }

    if (hasRoundEnded()) {
      console.log('Round has probably ended');
    }
  }, 100); // Delay of 1000 milliseconds (1 second)
}

function isNoMoreCalls() {
  const currentPlayer = ptq.getCurrentPlayer();

  const playersThatCalled = ptq.getPlayersWhoHaveCalled();
  console.log('Players that have called:' + playersThatCalled.length);

  if (ptq.anyPlayerHasRaised()) {
    const playersThatRaised = ptq.getPlayersWhoRaised();
    if (
      playersThatRaised.length === 1 &&
      playersThatRaised[0] === currentPlayer &&
      !playersThatCalled.includes(currentPlayer)
    ) {
      console.log(
        playersThatRaised[0].getName() +
          ' is the only one who has raised and everbody else called'
      );
      return true;
    }
  }
  return false;
}

function hasRoundEnded() {
  const currentPlayer = ptq.getCurrentPlayer();
  const nextPlayer = ptq.getNextPlayer();

  // Check if only one player remains active
  if (!nextPlayer && currentPlayer.isActive) {
    return true;
  }

  return false; // Round hasn't ended yet
}

function startNextTurn(currentPlayer) {
  if (currentPlayer.getIsMainPlayer(true)) {
    startMainPlayerTurn(ptq.getMainPlayerFromQ());
  } else {
    startNextCpuTurn(currentPlayer);
  }
}

function startNextCpuTurn(currentCpuPlayer) {
  const cpuBehaviour = setCpuBehaviour();

  switch (cpuBehaviour) {
    case 'safe':
      runSafeCpuBehaviour(currentCpuPlayer);
      break;

    case 'normal':
      runNormalCpuBehaviour(currentCpuPlayer);
      break;

    case 'aggressive':
      runAggressiveCpuBehaviour(currentCpuPlayer);
      break;

    case 'bluffing':
      runBluffingCpuBehaviour(currentCpuPlayer);
      break;

    default:
      alert('This should not happen');
      break;
  }
}

function runSafeCpuBehaviour(currentCpuPlayer) {
  switch (gsm.stage) {
    case 0: // Pre-flop
      if (
        cpuCanCall(currentCpuPlayer) &&
        bm.getCurrentBet() < currentCpuPlayer.getMoney() * 0.5 &&
        cpuHasStrongHand(currentCpuPlayer)
      ) {
        cpuCalls(currentCpuPlayer);
      } else {
        cpuFolds(currentCpuPlayer);
      }
      break;
    case 1: // Flop
      break;
    case 2: // Turn
      break;
    case 3: // River
      break;
    default:
      alert('This should not happen');
      break;
  }
}
function runNormalCpuBehaviour(currentCpuPlayer) {
  switch (gsm.stage) {
    case 0: // Pre-flop
      if (
        cpuCanCall(currentCpuPlayer) &&
        bm.getCurrentBet() < currentCpuPlayer.getMoney() * 0.5 &&
        cpuHasStrongHand(currentCpuPlayer)
      ) {
        cpuCalls(currentCpuPlayer);
      } else {
        cpuFolds(currentCpuPlayer);
      }
      break;
    case 1: // Flop
      cpuCanCall(currentCpuPlayer) && cpuHasStrongHand(currentCpuPlayer);
      break;
    case 2: // Turn
      break;
    case 3: // River
      break;
    default:
      alert('This should not happen');
      break;
  }
}
function runAggressiveCpuBehaviour(currentCpuPlayer) {
  switch (gsm.stage) {
    case 0: // Pre-flop
      if (
        cpuCanCall(currentCpuPlayer) &&
        bm.getCurrentBet() < currentCpuPlayer.getMoney() * 0.5 &&
        cpuHasStrongHand(currentCpuPlayer)
      ) {
        cpuCalls(currentCpuPlayer);
      } else {
        cpuFolds(currentCpuPlayer);
      }
      break;
    case 1: // Flop
      break;
    case 2: // Turn
      break;
    case 3: // River
      break;
    default:
      alert('This should not happen');
      break;
  }
}
function runBluffingCpuBehaviour(currentCpuPlayer) {
  switch (gsm.stage) {
    case 0: // Pre-flop
      if (
        cpuCanCall(currentCpuPlayer) &&
        bm.getCurrentBet() < currentCpuPlayer.getMoney() * 0.5 &&
        cpuHasStrongHand(currentCpuPlayer)
      ) {
        cpuCalls(currentCpuPlayer);
      } else {
        cpuFolds(currentCpuPlayer);
      }
      break;
    case 1: // Flop
      break;
    case 2: // Turn
      break;
    case 3: // River
      break;
    default:
      alert('This should not happen');
      break;
  }
}

function setCpuBehaviour() {
  const cpuBehaviours = ['normal', 'safe', 'aggressive', 'bluffing'];
  const randomIndex = Math.floor(Math.random() * cpuBehaviours.length);
  const cpuBehaviour = cpuBehaviours[randomIndex];

  return cpuBehaviour;
}

function cpuCanCall(currentCpuPlayer) {
  if (currentCpuPlayer.getMoney() >= bm.getCurrentBet()) {
    return true;
  } else {
    return false;
  }
}

function cpuCalls(currentCpuPlayer) {
  currentCpuPlayer.setHasCalled(true);

  const cpuCallAmount = bm.getCurrentBet(); // Call will always be last made bet

  addMessage(`${currentCpuPlayer.getName()} calls`);

  currentCpuPlayer.setMoney(currentCpuPlayer.getMoney() - cpuCallAmount);
  bm.addToPot(cpuCallAmount);

  ptq.dequeue(currentCpuPlayer);
  ptq.enqueue(currentCpuPlayer); // To the end of queue

  testFunction(ptq, bm); // This is stupid

  determineRound();
}

function cpuFolds(currentCpuPlayer) {
  const currentCpuPlayerStatusText = document.getElementById(
    `${currentCpuPlayer.getName()}-rank`
  );

  currentCpuPlayerStatusText.textContent = 'Fold';

  addMessage(`${currentCpuPlayer.getName()} folds`);

  ptq.dequeue(currentCpuPlayer);
  currentCpuPlayer.setIsActive(false);
  determineRound();
}

function cpuHasStrongHand(currentCpuPlayer) {
  const cpuPlayerFirstCard = currentCpuPlayer.getHand()[0].getValue();
  const cpuPlayerSecondCard = currentCpuPlayer.getHand()[1].getValue();

  switch (gsm.stage) {
    case 0: // Pre-flop
      if (
        (cpuPlayerFirstCard >= 10 && cpuPlayerSecondCard >= 10) ||
        currentCpuPlayer.getHandRank() === 2
      ) {
        return true;
      } else {
        return false;
      }
    case 1: // Flop
      if (
        (cpuPlayerFirstCard >= 10 && cpuPlayerSecondCard >= 10) ||
        currentCpuPlayer.getHandRank() >= 2
      ) {
        return true;
      } else {
        return false;
      }
    case 2: // Turn
      if (
        (cpuPlayerFirstCard >= 10 && cpuPlayerSecondCard >= 10) ||
        currentCpuPlayer.getHandRank() >= 2
      ) {
        return true;
      } else {
        return false;
      }
    case 3: // River
      if (
        (cpuPlayerFirstCard >= 10 && cpuPlayerSecondCard >= 10) ||
        currentCpuPlayer.getHandRank() >= 2
      ) {
        return true;
      } else {
        return false;
      }
    default:
      alert('When determening cpu strong hand something went wrong :[');
      break;
  }
}

function cpuRaises(currentCpuPlayer) {
  if (currentCpuPlayer.getMoney() >= bm.getCurrentBet() * 5) {
    const cpuRaiseAmount = bm.getCurrentBet() * 5;
    currentCpuPlayer.setMoney(currentCpuPlayer.getMoney() - cpuCallAmount);
    bm.addToPot(cpuRaiseAmount);
  } else {
    cpuFolds(currentCpuPlayer);
  }
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

function updatePlayerOptionsUI() {
  if (bm.getCurrentBet() === 0) {
    callCheckBtn.textContent = 'Check';
    betRaiseBtn.textContent = 'Bet';
    foldBtn.classList.add('hidden');
  } else {
    callCheckBtn.textContent = 'Call';
    betRaiseBtn.textContent = 'Raise';
    foldBtn.classList.remove('hidden');
  }

  if (bm.getCurrentBet() > ptq.getMainPlayerFromQ().getMoney()) {
    betRaiseBtn.classList.toggle('hidden');
  }
}

function setAllPlayersToActive(mainPlayer, cpuPlayers) {
  mainPlayer.setIsActive(true);
  cpuPlayers.forEach((cpuPlayer) => cpuPlayer.setIsActive(true));
}

function addActivePlayersToPTQ(mainPlayer, cpuPlayers) {
  const activePlayers = [mainPlayer, ...cpuPlayers];

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

function testFunction() {
  updateUI(ptq.getMainPlayerFromQ(), ptq.getCpuPlayersFromQ(), bm.getPot());
}

function startNextStage(comCards, deck) {
  gsm.increaseStage();

  if (gsm.stage === 1) {
    createFlop(deck, comCards);
  } else if (gsm.stage === 2 || gsm.stage === 3) {
    createTurnOrRiver(deck, comCards);
  } else {
    alert('Something went terribly wrong :(');
  }

  setHandRanks(ptq.getMainPlayerFromQ(), ptq.getCpuPlayersFromQ(), comCards);
  updateUI(ptq.getMainPlayerFromQ(), ptq.getCpuPlayersFromQ(), null);
  updateComCardsDOM(comCards);
  console.log(gsm.comCards);
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

function addMessage(text) {
  const messageContainer = document.getElementById('message-container');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');
  messageContainer.appendChild(messageDiv);

  let index = 0;

  function addLetter() {
    if (index < text.length) {
      if (text[index] === ' ') {
        messageDiv.innerText += '\u00A0'; // Use Unicode non-breaking space
      } else {
        messageDiv.innerText += text[index];
      }
      index++;
      messageContainer.scrollTop = messageContainer.scrollHeight;
      setTimeout(addLetter, 20); // Delay for 100 milliseconds between each letter
    }
  }

  addLetter();
}

export { mainPlayer, cpuPlayers, allPlayers };
