// These functions all return a boolean value to determine the outcome of a players hand.

// They all take resultCards as an argument which is a combined array of community cards and the cards that make out the player/cpu hand

// Besides returning true or false they also calculate the hand value to determine a winner in case of ties

function hasOnePair(resultCards, player) {
  let numPairs = 0; // Helper variable
  let pairs = [];

  let valueCounts = new Map();
  for (let card of resultCards) {
    let value = card.getValue();
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  for (let [value, count] of valueCounts) {
    if (count === 2) {
      pairs.push(value);
      numPairs++;
    }
  }

  if (numPairs === 1) {
    // Sort pairs in descending order
    pairs.sort((a, b) => b - a);
    // Keep only the two highest values
    pairs = pairs.slice(0, 2);
    player.setPairs(pairs);
    console.log(`${player.getName()} got one pair: ${player.getPairs()}`);
  }

  return numPairs === 1;
}

function hasTwoPair(resultCards, player) {
  let numPairs = 0;
  let pairs = [];

  let valueCounts = new Map();
  for (let card of resultCards) {
    let value = card.getValue();
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  for (let [value, count] of valueCounts) {
    if (count === 2) {
      numPairs++;
      pairs.push(value);
    }
  }

  // If player has two pairs, sets the values in the player.pairs array. This is used to compare hands later on.
  if (numPairs >= 2) {
    // Sort pairs in descending order
    pairs.sort((a, b) => b - a);
    // Keep only the two highest values since it's not allowed to have more than two pairs in texas hold em
    pairs = pairs.slice(0, 2);
    let sum = 0;

    for (let value of pairs) {
      sum += value;
    }

    console.log(sum);

    player.setPairs(pairs);
    console.log(`${player.getName()} got two pairs: ${player.getPairs()}`);
  }

  return numPairs >= 2;
}

function hasThreeOfAKind(resultCards, player) {
  let valueCounts = new Map();
  let threeOfAKindValue = 0;

  for (let card of resultCards) {
    let value = card.getValue();
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  for (let [value, count] of valueCounts) {
    if (count === 3) {
      threeOfAKindValue = value;
      player.setThreeOfAKindValue(threeOfAKindValue);
      console.log(
        `${player.getName()} got three of a kind: ${player.getThreeOfAKindValue()}`
      );
      return true;
    }
  }
  return false;
}

function hasFourOfAKind(resultCards, player) {
  let valueCounts = new Map();
  let fourOfAKindValue = 0;
  for (let card of resultCards) {
    let value = card.getValue();
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  for (let [value, count] of valueCounts) {
    if (count === 4) {
      fourOfAKindValue = value;
      player.setFourOfAKindValue(fourOfAKindValue);
      console.log(
        `${player.getName()} got four of a kind: ${player.getFourOfAKindValue()}`
      );
      return true;
    }
  }

  return false;
}

function hasFlush(resultCards, player) {
  let suiteCounts = new Map();

  for (let card of resultCards) {
    let suite = card.getSuite();
    suiteCounts.set(suite, (suiteCounts.get(suite) || 0) + 1);
  }

  let flushValues = [];

  for (let [suite, count] of suiteCounts) {
    if (count >= 5) {
      for (let card of resultCards) {
        if (card.getSuite() === suite) {
          flushValues.push(card.getValue());
        }
      }
      player.setFlushValue(flushValues);
      console.log(`${player.getName()} got a flush: ${player.getFlushValue()}`);
      return true;
    }
  }

  return false;
}

function hasStraight(resultCards, player) {
  let sortedCards = [...resultCards].sort(
    (card1, card2) => card2.getValue() - card1.getValue()
  );
  let consecutiveCount = 1;
  let straightValues = [sortedCards[0].getValue()];

  for (let i = 1; i < sortedCards.length; i++) {
    let currentVal = sortedCards[i].getValue();
    let prevVal = sortedCards[i - 1].getValue();

    if (currentVal === prevVal - 1) {
      consecutiveCount++;
      straightValues.push(currentVal);
    } else if (currentVal !== prevVal) {
      consecutiveCount = 1;
      straightValues = [currentVal];
    }

    if (consecutiveCount === 5) {
      player.setStraightValue(Math.max(...straightValues));
      console.log(
        `${player.getName()} got an ace high straight: ${player.getStraightValue()}`
      );
      return true;
    }
  }
  return false;
}

function hasLowStraight(resultCards, player) {
  adjustAces(resultCards);

  let sortedCards = [...resultCards].sort(
    (card1, card2) => card2.getValue() - card1.getValue()
  );
  let consecutiveCount = 1;
  let straightValues = [sortedCards[0].getValue()];

  for (let i = 1; i < sortedCards.length; i++) {
    let currentVal = sortedCards[i].getValue();
    let prevVal = sortedCards[i - 1].getValue();

    if (currentVal === prevVal - 1) {
      consecutiveCount++;
      straightValues.push(currentVal);
    } else if (currentVal !== prevVal) {
      consecutiveCount = 1;
      straightValues = [currentVal];
    }

    if (consecutiveCount === 5) {
      player.setStraightValue(Math.max(...straightValues));
      console.log(
        `${player.getName()} got a straight: ${player.getStraightValue()}`
      );
      correctAces(resultCards);
      return true;
    }
  }

  correctAces(resultCards);

  return false;
}

function hasStraightFlush(resultCards, player) {
  resultCards.sort((card1, card2) => card1.getValue() - card2.getValue());

  let consecutiveCount = 1;
  let straightFlushValues = [resultCards[0].getValue()];

  for (let i = 1; i < resultCards.length; i++) {
    let currentVal = resultCards[i].getValue();
    let prevVal = resultCards[i - 1].getValue();

    if (
      currentVal === prevVal + 1 &&
      resultCards[i].getSuite() === resultCards[i - 1].getSuite()
    ) {
      consecutiveCount++;
      straightFlushValues.push(currentVal);
    } else if (currentVal !== prevVal) {
      consecutiveCount = 1;
      straightFlushValues = [currentVal];
    }

    if (consecutiveCount >= 5) {
      player.setStraightFlushValue(Math.max(...straightFlushValues));
      console.log(
        `${player.getName()} got an ace high straight flush: ${player.getStraightFlushValue()}`
      );
      return true;
    }
  }

  correctAces(resultCards);

  return false;
}

function hasLowStraightFlush(resultCards, player) {
  adjustAces(resultCards);

  resultCards.sort((card1, card2) => card1.getValue() - card2.getValue());

  let consecutiveCount = 1;
  let straightFlushValues = [resultCards[0].getValue()];

  for (let i = 1; i < resultCards.length; i++) {
    let currentVal = resultCards[i].getValue();
    let prevVal = resultCards[i - 1].getValue();

    if (
      currentVal === prevVal + 1 &&
      resultCards[i].getSuite() === resultCards[i - 1].getSuite()
    ) {
      consecutiveCount++;
      straightFlushValues.push(currentVal);
    } else if (currentVal !== prevVal) {
      consecutiveCount = 1;
      straightFlushValues = [currentVal];
    }

    if (consecutiveCount >= 5) {
      player.setStraightFlushValue(Math.max(...straightFlushValues));
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
// Helper-function to correct the value of aces back to 14
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
