import Card from './Card.js';
import Player from './Player.js';
import {
  createDeck,
  createHand,
  createFlop,
  createTurnOrRiver,
  createAceLowStraightComCards,
  createAceLowStraightPlayerCards,
  createAceHighStraightComCards,
  createAceHighStraightPlayerCards,
  createAceHighStraightFlushComCards,
  createAceHighStraightFlushPlayerCards,
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

const comCardsDiv = document.querySelector('.community-cards');
const playerCardsDiv = document.querySelector('.player-cards');
const resultText = document.querySelector('.result h1');

const pkrBtn = document.querySelector('.pkr-btn button');

let deck = createDeck([]);

createCPUcards(deck);

let playerCards = [];
let comCards = [];
createHand(deck, playerCards);
createFlop(deck, comCards);

displayCards(comCards, playerCards);
consoleLogging(comCards, playerCards);

function displayCards(comCards, playerCards) {
  comCardsDiv.innerHTML = '';
  playerCardsDiv.innerHTML = '';

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

  for (let card of playerCards) {
    let pokerCardImg = document.createElement('img');
    pokerCardImg.className = 'poker-card';
    pokerCardImg.src = `./cardImages/${card.getName()}.png`;
    pokerCardImg.alt = '';

    playerCardsDiv.appendChild(pokerCardImg);
  }
  const result = scoreCards(comCards, playerCards);
  console.log(result);
  resultText.textContent = result;
}

function createCPUcards(deck) {
  for (let i = 0; i < 2; i++) {
    let player = new Player();
    player.setMoney(1000);
    player.setName(`CPU${i + 1}`);
    console.log(player.getName());
    let cpuCards = [];
    player.setHand(createHand(deck, cpuCards));
  }
}

function consoleLogging(comCards, playerCards) {
  const resultCards = [...comCards, ...playerCards];

  console.log(`Straight Flush: ${hasStraightFlush(resultCards)}
  Low Straight Flush: ${hasLowStraightFlush(resultCards)}
  Four Of A Kind: ${hasFourOfAKind(resultCards)}
  Straight: ${hasStraight(resultCards)}
  Low Straight: ${hasLowStraight(resultCards)}
  Flush: ${hasFlush(resultCards)}
  Three Of A Kind: ${hasThreeOfAKind(resultCards)}
  Two Pair: ${hasTwoPair(resultCards)}
  One Pair: ${hasOnePair(resultCards)}`);
  for (let card of comCards) {
    console.log(card.getName() + ' ' + card.getValue());
  }

  console.log('\n');

  for (let card of playerCards) {
    console.log(card.getName() + ' ' + card.getValue());
  }
}

pkrBtn.addEventListener('click', function () {
  createTurnOrRiver(deck, comCards);
  displayCards(comCards, playerCards);
  if (comCards.length === 5) {
    pkrBtn.classList.add('hidden');
  }
});

// Test purposes:
// createAceLowStraightPlayerCards(deck, playerCards);
// createAceLowStraightComCards(deck, comCards);
// createAceHighStraightPlayerCards(deck, playerCards);
// createAceHighStraightComCards(deck, comCards);
// createAceHighStraightFlushPlayerCards(deck, playerCards);
// createAceHighStraightFlushComCards(deck, comCards);
