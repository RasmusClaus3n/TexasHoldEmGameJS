import Card from './Card.js';
import Player from './Player.js';
import {
  createDeck,
  createHand,
  createFlop,
  createTurnOrRiver,
  createTestFlop,
  createMainPlayerTestHand,
  createCPU1TestHand,
  createCPU2TestHand,
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
import { rankHandRanks } from './DetermineWinner.js';
import { displayToDOM } from './DOMhandler.js';

let deck = createDeck([]);
// shuffleDeck(deck);

let cpuPlayers = createCPUplayers(deck);
let mainPlayer = createMainPlayer(deck);
let winner;

let comCards = [];
// createFlop(deck, comCards);
createTestFlop(deck, comCards);

setHandRanks(mainPlayer, cpuPlayers);

displayToDOM(comCards, mainPlayer, cpuPlayers);

winner = rankHandRanks(mainPlayer, cpuPlayers);

console.log(winner);

if (Array.isArray(winner)) {
  console.log('Tied winners!: ');
  for (const player of winner) {
    console.log(player.getName());
  }
} else {
  console.log(winner.getName() + ' wins');
}

function startNewStage() {} // TBI

function createCPUplayers(deck) {
  let cpuPlayers = [];

  for (let i = 0; i < 2; i++) {
    let cpu = new Player();
    cpu.setMoney(1000);
    cpu.setName(`CPU${i + 1}`);
    let cpuCards = [];
    // cpu.setHand(createHand(deck, cpuCards));
    if (cpu.getName() === 'CPU1') {
      cpu.setHand(createCPU1TestHand(deck, cpuCards));
    }
    if (cpu.getName() === 'CPU2') {
      cpu.setHand(createCPU2TestHand(deck, cpuCards));
    }

    cpuPlayers.push(cpu);
  }

  return cpuPlayers;
}

function createMainPlayer(deck) {
  let mainPlayer = new Player();
  mainPlayer.setMoney(1000);
  mainPlayer.setName('You');
  let mainPlayerCards = [];
  // mainPlayer.setHand(createHand(deck, mainPlayerCards));
  mainPlayer.setHand(createMainPlayerTestHand(deck, mainPlayerCards));

  return mainPlayer;
}

function setHandRanks(mainPlayer, cpuPlayers) {
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

// pkrBtn.addEventListener('click', function () {
//   createTurnOrRiver(deck, comCards);
//   setHandRanks(mainPlayer, cpuPlayers);
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
