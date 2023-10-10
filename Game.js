import Card from './Card.js';
import Player from './Player.js';
import {
  createDeck,
  createHand,
  createFlop,
  createTurnOrRiver,
  createTestFlop,
  createTestHand,
} from './DeckManager.js';
import { scoreCards } from './ScoreHandler.js';
import {
  hasOnePair,
  hasTwoPair,
  hasThreeOfAKind,
  hasFlush,
  hasStraight,
  hasFourOfAKind,
  hasStraightFlush,
  hasLowStraightFlush,
  hasLowStraight,
} from './HandEvaluator.js';
import { rankHandValues } from './DetermineWinner.js';
const comCardsDiv = document.querySelector('.community-cards');
const playerCardsDiv = document.querySelector('.player-cards');
const cpu1CardsDiv = document.querySelector('#cpu1-cards');
const cpu2CardsDiv = document.querySelector('#cpu2-cards');
const resultText = document.querySelector('.result h1');

const pkrBtn = document.querySelector('.pkr-btn button');

let deck = createDeck([]);

let cpuPlayers = createCPUplayers(deck);
let mainPlayer = createMainPlayer(deck);

let comCards = [];
createFlop(deck, comCards);
// createTestFlop(deck, comCards);

setHandValues(mainPlayer, cpuPlayers);

displayToDOM(comCards, mainPlayer, cpuPlayers);

rankHandValues(mainPlayer, cpuPlayers);

function startNewStage() {} // TBI

function displayToDOM(comCards, mainPlayer, cpuPlayers) {
  comCardsDiv.innerHTML = '';
  playerCardsDiv.innerHTML = '';
  cpu1CardsDiv.innerHTML = '';
  cpu2CardsDiv.innerHTML = '';

  for (let card of comCards) {
    let pokerCardImg = document.createElement('img');
    pokerCardImg.className = 'poker-card';
    pokerCardImg.src = `./cardImages/${card.getName()}.png`;
    pokerCardImg.alt = '';

    comCardsDiv.appendChild(pokerCardImg);
  }

  for (let i = 1; i < 6 - comCards.length; i++) {
    let backCardImg = document.createElement('img');
    backCardImg.className = 'poker-card';
    backCardImg.src = './cardImages/back_blue.png';
    backCardImg.alt = '';

    comCardsDiv.appendChild(backCardImg);
  }

  for (let card of mainPlayer.getHand()) {
    let pokerCardImg = document.createElement('img');
    pokerCardImg.className = 'poker-card';
    pokerCardImg.src = `./cardImages/${card.getName()}.png`;
    pokerCardImg.alt = '';

    playerCardsDiv.appendChild(pokerCardImg);
  }

  for (let cpu of cpuPlayers) {
    for (let card of cpu.getHand()) {
      let pokerCardImg = document.createElement('img');
      pokerCardImg.className = 'poker-card';
      pokerCardImg.src = `./cardImages/${card.getName()}.png`;
      pokerCardImg.alt = '';

      if (cpu.getName() === 'CPU1') {
        cpu1CardsDiv.appendChild(pokerCardImg);
      } else if (cpu.getName() === 'CPU2') {
        cpu2CardsDiv.appendChild(pokerCardImg);
      }
    }

    let cpuResultText = document.createElement('h1');
    cpuResultText.textContent = cpu.getHandValue();

    if (cpu.getName() === 'CPU1') {
      cpu1CardsDiv.appendChild(cpuResultText);
    } else if (cpu.getName() === 'CPU2') {
      cpu2CardsDiv.appendChild(cpuResultText);
    }
  }

  resultText.textContent = mainPlayer.getHandValue();
}

function createCPUplayers(deck) {
  let cpuPlayers = [];

  for (let i = 0; i < 2; i++) {
    let cpu = new Player();
    cpu.setMoney(1000);
    cpu.setName(`CPU${i + 1}`);
    let cpuCards = [];
    cpu.setHand(createHand(deck, cpuCards));

    cpuPlayers.push(cpu);
  }

  return cpuPlayers;
}

function createMainPlayer(deck) {
  let mainPlayer = new Player();
  mainPlayer.setMoney(1000);
  mainPlayer.setName('You');
  let mainPlayerCards = [];
  mainPlayer.setHand(createHand(deck, mainPlayerCards));
  // mainPlayer.setHand(createTestHand(deck, mainPlayerCards));

  return mainPlayer;
}

function setHandValues(mainPlayer, cpuPlayers) {
  mainPlayer.setHandValue(scoreCards(comCards, mainPlayer));
  for (let cpu of cpuPlayers) {
    cpu.setHandValue(scoreCards(comCards, cpu));
  }
}

function createPokerCardImg() {}

// pkrBtn.addEventListener('click', function () {
//   createTurnOrRiver(deck, comCards);
//   setHandValues(mainPlayer, cpuPlayers);
//   displayToDOM(comCards, mainPlayer, cpuPlayers);
//   if (comCards.length === 5) {
//     pkrBtn.classList.add('hidden');
//   }
// });

// Test purposes:
// createAceLowStraightPlayerCards(deck, playerCards);
// createAceLowStraightComCards(deck, comCards);
// createAceHighStraightPlayerCards(deck, playerCards);
// createAceHighStraightComCards(deck, comCards);
// createAceHighStraightFlushPlayerCards(deck, playerCards);
// createAceHighStraightFlushComCards(deck, comCards);
