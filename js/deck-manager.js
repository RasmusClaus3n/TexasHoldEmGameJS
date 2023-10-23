import Card from '../classes/Card.js';

function createDeck(cards) {
  // Assigning suites to each card in deck
  for (let i = 1; i <= 52; i++) {
    let card = new Card();

    if (i <= 13) {
      card.setSuite('hearts');
    }
    if (i > 13 && i <= 26) {
      card.setSuite('diamonds');
    }
    if (i > 26 && i <= 39) {
      card.setSuite('clubs');
    }
    if (i > 39) {
      card.setSuite('spades');
    }

    cards.push(card);
  }
  // Assigning values to each card in deck
  for (let i = 0; i < 52; i++) {
    let value = (i % 13) + 2;

    // Special case for aces
    if (value === 1) {
      cards[i].setValue(14);
    } else {
      cards[i].setValue(value);
    }
  }

  for (let card of cards) {
    let value = card.getValue();
    let suite = '';

    // Both switch statements assigns the name for the card
    switch (card.getSuite()) {
      case 'hearts':
        suite = '♥';
        break;
      case 'diamonds':
        suite = '♦';
        break;
      case 'clubs':
        suite = '♣';
        break;
      case 'spades':
        suite = '♠';
        break;
      default:
        break;
    }

    switch (value) {
      case 14:
        card.setName(suite + 'A');
        break;
      case 11:
        card.setName(suite + 'J');
        break;
      case 12:
        card.setName(suite + 'Q');
        break;
      case 13:
        card.setName(suite + 'K');
        break;
      default:
        card.setName(suite + value);
        break;
    }
  }

  return cards; // Returns deck
}

function createHand(deck, playerCards) {
  // Picks two random cards from the deck
  for (let i = 0; i < 2; i++) {
    let randomIndex = Math.floor(Math.random() * 52);

    // If the card is null it should not be picked
    // FIXME this can cause an infinite loop if all cards are null
    while (deck[randomIndex] === null) {
      randomIndex = Math.floor(Math.random() * 52);
    }

    playerCards.push(deck[randomIndex]); // Puts the picked card into the the player cards array

    deck[randomIndex] = null; // Sets the picked card to null in the deck
  }

  return playerCards; // Returns the player cards
}

function createFlop(deck, comCards) {
  // Picks three random cards from deck
  for (let i = 0; i < 5; i++) {
    let randomIndex = Math.floor(Math.random() * 52);

    // If card is null picks another card
    // FIXME this can cause an infinite loop if all cards are null
    while (deck[randomIndex] === null) {
      randomIndex = Math.floor(Math.random() * 52);
    }

    comCards.push(deck[randomIndex]); // Puts picked card into community cards array
    deck[randomIndex] = null; // Sets picked card to null in deck
  }

  return comCards; // Returns the community cards
}

function createTurnOrRiver(deck, comCards) {
  let randomIndex = Math.floor(Math.random() * 52); // Picks one random card from the deck

  // If card is null picks another card
  // FIXME this can cause an infinite loop if all cards are null
  while (deck[randomIndex] === null) {
    randomIndex = Math.floor(Math.random() * 52);
  }

  comCards.push(deck[randomIndex]); // Puts picked card into the community cards array
  deck[randomIndex] = null; // Sets picked card to null in deck
}

function createTestFlop(deck, comCards) {
  comCards.push(deck[1]);
  comCards.push(deck[2]);
  comCards.push(deck[3]);
  comCards.push(deck[3]);
  comCards.push(deck[4]);
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

function createMainPlayerTestHand(deck, playerCards) {
  playerCards.push(deck[0]);
  playerCards.push(deck[24]);

  return playerCards; // Returns the player cards
}

function createCPU1TestHand(deck, playerCards) {
  playerCards.push(deck[0]);
  playerCards.push(deck[24]);
  return playerCards; // Returns the player cards
}

function createCPU2TestHand(deck, playerCards) {
  playerCards.push(deck[11]);
  playerCards.push(deck[42]);
  return playerCards; // Returns the player cards
}

function shuffleDeck(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

export {
  createDeck,
  createHand,
  createFlop,
  createTurnOrRiver,
  createTestFlop,
  createMainPlayerTestHand,
  createCPU1TestHand,
  createCPU2TestHand,
  setCpuHoleCards,
  setMainPlayerHoleCards,
  shuffleDeck,
};
