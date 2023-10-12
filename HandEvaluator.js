// These functions all return a boolean value to determine the outcome of a players hand.

// They all take resultCards as an argument which is a combined array of community cards and the cards that make out the player hand

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
    player.setKickers(findKickers(resultCards, pairs, player));
    console.log(`${player.getName()} got one pair: ${player.getPairs()}`);
    console.log(`${player.getName()} kickers: ${player.getKickers()}`);
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
      pairs.push(value); // Not the greatest solution
      pairs.push(value);
    }
  }
  //  If player has two pairs, sets the values in the player array.
  //  This is used to compare hands later on.
  if (numPairs >= 2) {
    // Sort pairs in descending order
    pairs.sort((a, b) => b - a);
    //  Keep only the two highest pairs since it's not allowed to have more than
    //  two pairs in texas hold em
    pairs = pairs.slice(0, 4);

    player.setPairs(pairs);
    player.setKickers(findKickers(resultCards, pairs, player));
    console.log(`${player.getName()} got two pairs: ${player.getPairs()}`);
    console.log(`${player.getName()} kickers: ${player.getKickers()}`);
  }

  return numPairs >= 2;
}

function hasThreeOfAKind(resultCards, player) {
  let valueCounts = new Map();
  let threeOfAKindValues = [];

  for (let card of resultCards) {
    let value = card.getValue();
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  for (let [value, count] of valueCounts) {
    // A three of a kind has been detected if count is 3
    if (count === 3) {
      // Stores all the values that makes up the three of a kind
      for (let i = 0; i < 3; i++) {
        threeOfAKindValues.push(value);
      }
      player.setThreeOfAKindValue(threeOfAKindValues); // Saves the values into the player array. Used for determening winner and setting kickers.
      console.log(
        `${player.getName()} got three of a kind: ${player.getThreeOfAKindValue()}`
      );
      player.setKickers(findKickers(resultCards, threeOfAKindValues, player));
      console.log('Kickers: ' + player.getKickers());
      return true;
    }
  }

  return false;
}

function hasFourOfAKind(resultCards, player) {
  let valueCounts = new Map();
  let fourOfAKindValues = [];
  for (let card of resultCards) {
    let value = card.getValue();
    valueCounts.set(value, (valueCounts.get(value) || 0) + 1);
  }

  for (let [value, count] of valueCounts) {
    if (count === 4) {
      for (let i = 0; i < 4; i++) {
        fourOfAKindValues.push(value);
      }
      player.setFourOfAKindValue(fourOfAKindValues);
      player.setKickers(findKickers(resultCards, fourOfAKindValues));
      console.log(
        `${player.getName()} got four of a kind: ${player.getFourOfAKindValue()}`
      );
      console.log('Kickers: ' + player.getKickers());
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
      flushValues.sort((a, b) => b - a); // Sort in descending order
      flushValues = flushValues.slice(0, 5); // Take the top 5 cards

      player.setFlushValue(flushValues);

      // No need to set the kickers since a five card poker hand is already
      // set in case of a flush
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
      straightValues.sort((a, b) => b - a); // Sort in descending order
      straightValues = straightValues.slice(0, 5); // Take the top 5 cards
      player.setStraightValue(straightValues);

      // No need so set kickers since a straight makes out a five card hand
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
      straightValues.sort((a, b) => b - a); // Sort in descending order
      straightValues = straightValues.slice(0, 5); // Take the top 5 cards
      player.setStraightValue(straightValues);
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
      straightFlushValues.sort((a, b) => b - a); // Sort in descending order
      straightFlushValues = straightFlushValues.slice(0, 5); // Take the top 5 cards
      player.setStraightFlushValue(straightFlushValues);
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
      straightFlushValues.sort((a, b) => b - a); // Sort in descending order
      straightFlushValues = straightFlushValues.slice(0, 5); // Take the top 5 cards
      player.setStraightFlushValue(straightFlushValues);
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

function findKickers(resultCards, handValues, player) {
  // Filter out card values that were used in forming the main hand

  if (!player.getKickers()) {
    let unusedValues = resultCards
      .map((card) => card.getValue())
      .filter((value) => !handValues.includes(value));

    // Sort the unused card values
    unusedValues.sort((value1, value2) => value2 - value1);

    // Return the highest unpaired card values (kickers):
    // Since a poker hand can only contain 5 cards maximum, the amount of kickers
    // that can possibly be included in the hand is determined by the length of
    // handValues
    if (handValues.length === 1) {
      return unusedValues.slice(0, 4); // Top 4 kickers
    } else if (handValues.length === 2) {
      return unusedValues.slice(0, 3); // Top 3 kickers
    } else if (handValues.length === 3) {
      return unusedValues.slice(0, 2); // Top 2 kickers
    } else if (handValues.length === 4) {
      return unusedValues.slice(0, 1); // Top 1 kicker
    }
  }
  return;
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
  findKickers,
};
