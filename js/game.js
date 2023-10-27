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

const messages = [];

const gsm = new GameStateManager(); // Stores players, deck and community cards
const bm = new BettingManager(); // Manages money transactions and current bet
const ptq = new PlayerTurnQueue(); // Determines player turn during hands

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

if (!cpuPlayers || !mainPlayer) {
  cpuPlayers = createCPUplayers();
  mainPlayer = createMainPlayer();
}

startGame(mainPlayer, cpuPlayers);

function startGame(mainPlayer, cpuPlayers) {
  mainPlayer.setIsMainPlayer(true);

  gsm.mainPlayer = mainPlayer;
  gsm.cpuPlayers = cpuPlayers;

  gsm.setAllPlayers([mainPlayer, ...cpuPlayers]);

  console.log(gsm.allPlayers);

  startNewHand();
  // startMainPlayerTurn(ptq.getMainPlayerFromQ());

  // winner = rankHandRanks(gsm.getMainPlayer(), gsm.getCpuPlayers());
  // logWinner(winner);
}

function startNewHand() {
  setTimeout(() => {
    if (gsm.mainPlayer.isBust) {
      console.log('You lose');
    }

    // if (gsm.allPlayers) {
    //   gsm.allPlayers.forEach((player) => {
    //     ptq.dequeue(player);
    //     ptq.enqueue(player);
    //   });
    // }

    setAllPlayersToActive(gsm.mainPlayer, gsm.cpuPlayers);
    addActivePlayersToPTQ(gsm.mainPlayer, gsm.cpuPlayers, ptq);

    clearStatuses(ptq.getAllPlayersFromQ());

    addMessage('New Hand!');

    bm.setCurrentBet(0);

    gsm.stage = 0;
    gsm.comCards = [];

    gsm.deck = createDeck([]);
    shuffleDeck(gsm.deck);

    setMainPlayerHoleCards(gsm.mainPlayer, gsm.deck);
    setCpuHoleCards(gsm.cpuPlayers, gsm.deck);

    setHandRanks(gsm.mainPlayer, gsm.cpuPlayers, gsm.comCards);
    displayToDOM(gsm.mainPlayer, gsm.cpuPlayers, gsm.comCards);

    setBlinds([ptq.getMainPlayerFromQ(), ...ptq.getCpuPlayersFromQ()], bm);

    updateUI(ptq.getMainPlayerFromQ(), ptq.getCpuPlayersFromQ(), bm.getPot());

    console.log('Pot: ' + bm.getPot());

    determineEndOfHand();
  }, 1000);
}

function determineEndOfHand() {
  setTimeout(() => {
    const currentPlayer = ptq.getCurrentPlayer();

    // currentPlayer is alone
    if (!ptq.getNextPlayer()) {
      addMessage(currentPlayer.getName() + ' win!', 'pink');
      takeMoneyFromPot(currentPlayer);
      startNewHand();
    } else if (isNoMoreCalls()) {
      addMessage('No more bets');
      startNextStage(gsm.comCards, gsm.deck);
    } else {
      startNextTurn(currentPlayer);
    }
  }, 1000);
}

function startMainPlayerTurn(mainPlayer) {
  // updatePlayerOptionsUI();
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
}

function isNoMoreCalls() {
  const currentPlayer = ptq.getCurrentPlayer();

  const playersThatCalled = ptq.getPlayersWhoHaveCalled();
  console.log('Players that have called:' + playersThatCalled.length);

  if (playersThatCalled.length === ptq.getCpuPlayersFromQ().length) {
    return true;
  }

  if (ptq.anyPlayerHasRaised()) {
    const playersThatRaised = ptq.getPlayersWhoRaised();
    if (
      playersThatRaised.length === 1 &&
      playersThatRaised[0] === currentPlayer
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

function startNextTurn(currentPlayer) {
  if (currentPlayer.getIsMainPlayer(true)) {
    startMainPlayerTurn(ptq.getMainPlayerFromQ());
  } else {
    startNextCpuTurn(currentPlayer);
  }
}

function startNextStage(comCards, deck) {
  gsm.increaseStage();

  if (gsm.stage === 1) {
    createFlop(deck, comCards);
    addMessage('Showing flop');
  } else if (gsm.stage === 2) {
    createTurnOrRiver(deck, comCards);
    addMessage('Showing turn');
  } else if (gsm.stage === 3) {
    createTurnOrRiver(deck, comCards);
    addMessage('Showing river');
  } else if (gsm.stage === 4) {
    startShowDown();
  }

  setHandRanks(ptq.getMainPlayerFromQ(), ptq.getCpuPlayersFromQ(), comCards);
  updateUI(ptq.getMainPlayerFromQ(), ptq.getCpuPlayersFromQ(), null);
  updateComCardsDOM(comCards);

  clearStatuses(ptq.getAllPlayersFromQ());

  bm.setCurrentBet(0);

  determineEndOfHand();
}

// Fix
function startShowDown() {
  addMessage('Showdown!');
  const winner = rankHandRanks(
    ptq.getMainPlayerFromQ(), // These can be null. Fix.
    ptq.getCpuPlayersFromQ()
  );

  if (Array.isArray(winner)) {
    // It's a tie
    addMessage("It's a " + winner[0].getHandRankName + ' tie between:');
    winner.forEach((player) => {
      addMessage(player.getName());
    });
    splitPot(winner);
  } else if (winner === ptq.getMainPlayerFromQ()) {
    addMessage(
      winner.getName() + ' win with a ' + winner.getHandRankName() + '!'
    );
    takeMoneyFromPot(winner);
  } else {
    addMessage(winner.getName() + ' wins with a ' + winner.getHandRankName());
    takeMoneyFromPot(winner);
  }

  startNewHand();
}

function splitPot(winner) {
  const pot = bm.getPot();
  const totalWinners = winner.length;
  const amountPerWinner = Math.floor(pot / totalWinners);

  winner.forEach((player) => {
    player.setMoney(player.getMoney() + amountPerWinner);
  });

  bm.clearPot();
}
function takeMoneyFromPot(winner) {
  const pot = bm.getPot();
  winner.setMoney(winner.getMoney() + pot);
  bm.clearPot();
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
function setCpuBehaviour() {
  // const cpuBehaviours = ['safe', 'normal',  'aggressive', 'bluffing'];
  const cpuBehaviours = ['safe'];
  const randomIndex = Math.floor(Math.random() * cpuBehaviours.length);
  const cpuBehaviour = cpuBehaviours[randomIndex];

  return cpuBehaviour;
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
    case 2: // Turn
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
    case 3: // River
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

  addMessage(`${currentCpuPlayer.getName()} calls`, '#49f849');

  currentCpuPlayer.setMoney(currentCpuPlayer.getMoney() - cpuCallAmount);
  bm.addToPot(cpuCallAmount);

  ptq.dequeue(currentCpuPlayer);
  ptq.enqueue(currentCpuPlayer); // To end of queue

  updatePlayerStatusDOM(currentCpuPlayer, 'Call');

  testFunction(ptq, bm); // This is stupid

  determineEndOfHand();
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
function cpuFolds(currentCpuPlayer) {
  updatePlayerStatusDOM(currentCpuPlayer, 'Fold');

  addMessage(`${currentCpuPlayer.getName()} folds`, 'red');

  ptq.dequeue(currentCpuPlayer);
  currentCpuPlayer.setIsActive(false);
  determineEndOfHand();
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

// Change this
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

function clearStatuses(allActivePlayers) {
  console.log('Clearing statuses');
  allActivePlayers.forEach((player) => {
    player.hasCalled = false;
    player.hasRaised = false;
  });
}

function addMessage(text, color) {
  const messageContainer = document.getElementById('message-container');
  const messageDiv = document.createElement('div');
  messageDiv.classList.add('message');

  if (color) {
    messageDiv.style.color = color;
  }

  messageContainer.appendChild(messageDiv);

  messages.push(text);
  if (messages.length > 4) {
    messageContainer.removeChild(messageContainer.firstChild);
  }

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
      setTimeout(addLetter, 40);
    }
  }

  addLetter();
}

function updatePlayerStatusDOM(currentPlayer, status) {
  const currentCpuPlayerStatusText = document.getElementById(
    `${currentPlayer.getName()}-status-text`
  );

  currentCpuPlayerStatusText.textContent = status;
}

// Event listeners

confirmRaiseBtn.addEventListener('click', function () {
  const mainPlayer = ptq.getMainPlayerFromQ();
  const mainPlayerMoney = mainPlayer.getMoney();

  mainPlayer.setHasRaised(true);

  const raiseAmount = parseInt(slider.value);

  bm.addToPot(raiseAmount);
  bm.setCurrentBet(raiseAmount);

  mainPlayer.setMoney(mainPlayerMoney - raiseAmount);
  console.log('My money:' + mainPlayer.getMoney());

  addMessage(`You raised $${raiseAmount}`, 'yellow');

  // Reset the slider value and text
  slider.value = slider.min;
  const raiseMoneyText = document.querySelector('.raise-money');
  raiseMoneyText.textContent = `$${slider.min}`;

  updateUI(mainPlayer, null, bm.getPot());

  ptq.dequeue(mainPlayer);
  ptq.enqueue(mainPlayer);

  determineEndOfHand(ptq, bm);
});

foldBtn.addEventListener('click', function () {
  ptq.dequeue(ptq.getMainPlayerFromQ());
  determineEndOfHand();
  // TBI
});

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
