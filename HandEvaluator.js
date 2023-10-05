// These functions all return a boolean value to determine the outcome of a players hand.
// They all take resultCards as an argument which is a combined array of community cards and player cards

function hasOnePair(resultCards) {
  let numPairs = 0; // Helper variable

  let valueCounts = new Map();
  for (let card of resultCards) {
    let value = card.getValue();
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  for (let count of valueCounts.values()) {
    if (count === 2) {
      numPairs++;
    }
  }

  return numPairs === 1;
}

function hasTwoPair(resultCards) {
  let numPairs = 0;

  let valueCounts = new Map();
  for (let card of resultCards) {
    let value = card.getValue();
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  for (let count of valueCounts.values()) {
    if (count === 2) {
      numPairs++;
    }
  }

  return numPairs === 2;
}

function hasThreeOfAKind(resultCards) {
  let valueCounts = new Map();
  for (let card of resultCards) {
    let value = card.getValue();
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  for (let count of valueCounts.values()) {
    if (count === 3) {
      return true;
    }
  }

  return false;
}

function hasFourOfAKind(resultCards) {
  let valueCounts = new Map();
  for (let card of resultCards) {
    let value = card.getValue();
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  for (let count of valueCounts.values()) {
    if (count === 4) {
      return true;
    }
  }

  return false;
}

function hasFlush(resultCards) {
  let suiteCounts = new Map();
  for (let card of resultCards) {
    let suite = card.getSuite();
    suiteCounts.set(suite, (suiteCounts.get(suite) || 0) + 1);
  }

  for (let count of suiteCounts.values()) {
    if (count === 5) {
      return true;
    }
  }

  return false;
}

function hasStraight(resultCards) {
  let hasStraight = false;

  // let straightCards = [];
  resultCards.sort((card1, card2) => card2.getValue() - card1.getValue());

  let consecutiveCount = 1;

  for (let i = 1; i < resultCards.length; i++) {
    let currentVal = resultCards[i].getValue();
    let prevVal = resultCards[i - 1].getValue();

    if (currentVal === 14 && prevVal === 2 && i === 1) {
      currentVal = 1;
    }

    // if (currentVal === prevVal - 1) {
    //   straightCards.push(resultCards[i]);
    //   consecutiveCount++;
    // } else if (currentVal !== prevVal) {
    //   consecutiveCount = 1;
    //   straightCards = [resultCards[i]];
    // }

    if (consecutiveCount === 5) {
      hasStraight = true;
      break;
    }
  }

  // if (!straightCards.length) {
  //   return hasStraight;
  // }

  // let nextCardValue = straightCards[0].getValue() + 1;
  // while (straightCards.length < 5) {
  //   let nextCard = resultCards.find(
  //     (card) => card.getValue() === nextCardValue
  //   );
  //   if (nextCard) {
  //     straightCards.push(nextCard);
  //     nextCardValue++;
  //   } else {
  //     break;
  //   }
  // }

  return hasStraight;
}

function hasStraightFlush(resultCards) {
  resultCards.sort((card1, card2) => card1.getValue() - card2.getValue());

  let consecutiveCount = 1;

  for (let i = 1; i < resultCards.length; i++) {
    let currentVal = resultCards[i].getValue();
    let prevVal = resultCards[i - 1].getValue();

    if (
      currentVal === prevVal + 1 &&
      resultCards[i].getSuite() === resultCards[i - 1].getSuite()
    ) {
      consecutiveCount++;
    } else if (currentVal !== prevVal) {
      consecutiveCount = 1;
    }

    if (consecutiveCount === 5) {
      return true;
    }
  }

  return false;
}

export {
  hasOnePair,
  hasTwoPair,
  hasThreeOfAKind,
  hasFlush,
  hasStraight,
  hasFourOfAKind,
  hasThreeOfAKind,
  hasStraightFlush,
};
