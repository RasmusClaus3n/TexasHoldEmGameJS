import Card from './Card.js';
import {
  createDeck,
  createPlayerCards,
  createFlop,
  createTurnOrRiver,
} from './DeckManager.js';
import { scoreCards } from './ScoreHandler.js';

const comCardsDiv = document.querySelector('.community-cards');
const playerCardsDiv = document.querySelector('.player-cards');

const pkrBtn = document.querySelector('.pkr-btn button');

function displayCards(comCards, playerCards) {
  comCardsDiv.innerHTML = '';
  playerCardsDiv.innerHTML = '';

  for (let card of comCards) {
    console.log(card.getName() + ' ');

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

  console.log('\n');

  for (let card of playerCards) {
    console.log(card.getName() + ' ');

    let pokerCardImg = document.createElement('img');
    pokerCardImg.className = 'poker-card';
    pokerCardImg.src = `./cardImages/${card.getName()}.png`;
    pokerCardImg.alt = '';

    playerCardsDiv.appendChild(pokerCardImg);
  }

  console.log('\n');
  console.log(scoreCards(comCards, playerCards));
}

let deck = createDeck([]);

let playerCards = [];
createPlayerCards(deck, playerCards);
let comCards = [];
createFlop(deck, comCards);
displayCards(comCards, playerCards);

pkrBtn.addEventListener('click', function () {
  createTurnOrRiver(deck, comCards);
  displayCards(comCards, playerCards);
  if (comCards.length === 5) {
    pkrBtn.classList.add('hidden');
  }
});
