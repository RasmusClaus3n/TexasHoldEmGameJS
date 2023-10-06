// These functions all return a boolean value to determine the outcome of a players hand.
// They all take resultCards as an argument which is a combined array of community cards and the cards that make out the player hand

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
    if (count >= 5) {
      return true;
    }
  }

  return false;
}

function hasStraight(resultCards) {
  let sortedCards = [...resultCards].sort(
    (card1, card2) => card2.getValue() - card1.getValue()
  );
  let consecutiveCount = 1;

  for (let i = 1; i < sortedCards.length; i++) {
    let currentVal = sortedCards[i].getValue();
    let prevVal = sortedCards[i - 1].getValue();

    if (currentVal === prevVal - 1) {
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

function hasLowStraight(resultCards) {
  adjustAces(resultCards);

  let sortedCards = [...resultCards].sort(
    (card1, card2) => card2.getValue() - card1.getValue()
  );
  let consecutiveCount = 1;

  for (let i = 1; i < sortedCards.length; i++) {
    let currentVal = sortedCards[i].getValue();
    let prevVal = sortedCards[i - 1].getValue();

    if (currentVal === prevVal - 1) {
      consecutiveCount++;
    } else if (currentVal !== prevVal) {
      consecutiveCount = 1;
    }

    if (consecutiveCount === 5) {
      correctAces(resultCards);
      return true;
    }
  }

  correctAces(resultCards);

  return false;
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

    if (consecutiveCount >= 5) {
      return true;
    }
  }

  correctAces(resultCards);

  return false;
}

function hasLowStraightFlush(resultCards) {
  adjustAces(resultCards);

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

    if (consecutiveCount >= 5) {
      return true;
    }
  }

  correctAces(resultCards);

  return false;
}

// Helper-function to adjust the value of aces to 1 in case of low straight
function adjustAces(resultCards) {
  for (let card of resultCards) {
    if (card.getValue() === 14) {
      card.setValue(1);
    }
  }
}
// Helper-function to assign the value of aces back to 14
function correctAces(resultCards) {
  for (let card of resultCards) {
    if (card.getValue() === 1) {
      card.setValue(14);
    }
  }
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
  hasLowStraightFlush,
  hasLowStraight,
};
