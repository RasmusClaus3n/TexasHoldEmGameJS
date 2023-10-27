import Player from '../classes/Player.js';

let isWinner = false;

function rankHandRanks(player, cpuPlayers) {
  let allPlayers;

  if (player) {
    allPlayers = [player, ...cpuPlayers];
  } else {
    allPlayers = cpuPlayers;
  }
  const allHandRanks = allPlayers.map((player) => player.getHandRank());
  const highestHandRank = Math.max(...allHandRanks);
  const contenders = allPlayers.filter(
    // Exclude players who doesn't have highest hand rank
    (player) => player.getHandRank() === highestHandRank
  );

  if (contenders.length === 1) {
    // Only one player in contenders = winner
    const winner = contenders[0];
    console.log(`${winner.getName()} wins!`);
    return winner;
  }

  // Else compare hands
  switch (highestHandRank) {
    case 1:
      console.log('High Card Tie');
      return compareHighCards(contenders);
    case 2:
      console.log('One Pair Tie');
      return compareOnePairs(contenders);
    case 3:
      console.log('Two Pairs Tie');
      return compareTwoPairs(contenders);
    case 4:
      console.log('Three Of A Kind Tie');
      return compareThreeOfAKinds(contenders);
    case 5:
      console.log('Straight Tie');
      return compareStraights(contenders);
    case 6:
      console.log('Flush Tie');
      return compareFlushes(contenders);
    case 7:
      console.log('Full House Tie');
      return compareFullHouses(contenders);
    case 8:
      console.log('Four Of A Kind Tie');
      return compareFourOfAKinds(contenders);
    case 9:
      console.log('Straight Flush Tie');
      return compareStraights(contenders);
    // Add more cases as needed
    default:
      console.log('Unknown highestHandRank');
      break;
  }
}

function compareHighCards(contenders) {
  if (
    // Check if all players have the same high card value
    contenders.every(
      (player) => player.getHighCard() === contenders[0].getHighCard()
    )
  ) {
    return contenders;
  }

  const highestHighCardValue = Math.max(
    ...contenders.map((player) => player.getHighCard())
  );

  contenders = contenders.filter(
    (player) => player.getHighCard()[0] === highestHighCardValue
  );

  if (contenders.length === 1) {
    return contenders[0];
  }

  return compareKickers(contenders);
}

function compareOnePairs(contenders) {
  console.log('Comparing one pairs...');

  let winner;
  let isPairTie = false;

  setHighAndLowPairValue(contenders);

  if (
    // Check if all players have the same high pair value
    contenders.every(
      (player) => player.getHighPairValue() === contenders[0].getHighPairValue()
    )
  ) {
    isPairTie = true;
    console.log('Identical pairs');
  }

  if (!isPairTie) {
    const highestHighPairValue = Math.max(
      // What the higehst pair value is
      ...contenders.map((player) => player.getHighPairValue())
    );

    contenders = contenders.filter(
      (player) => player.getHighPairValue() === highestHighPairValue // Include only players with the highest pair value
    );

    if (contenders.length === 1) {
      winner = contenders[0];
      console.log(winner.getName() + ' has the highest one pair');
      return winner;
    } else {
      isPairTie = true;
    }
  }

  if (isPairTie && contenders[0].getHandRank() < 7) {
    // Don't compare kickers if full house
    console.log("It's a pair tie");
    return compareKickers(contenders);
  } else {
    console.log('After comparing pairs: Full House Tie!');
    return contenders;
  }
}

function compareTwoPairs(contenders) {
  console.log('Comparing two pairs...');

  let winner;
  let isHighPairTie = false;
  let isLowPairTie = false;

  setHighAndLowPairValue(contenders);

  if (
    // Check if all players have the same high pair value
    contenders.every(
      (player) => player.getHighPairValue() === contenders[0].getHighPairValue()
    )
  ) {
    isHighPairTie = true;
    console.log('Identical high pairs');
  }

  if (!isHighPairTie) {
    const highestHighPairValue = Math.max(
      // What the higehst pair value is
      ...contenders.map((player) => player.getHighPairValue())
    );

    contenders = contenders.filter(
      (player) => player.getHighPairValue() === highestHighPairValue // Include only players with the highest pair value
    );

    if (contenders.length === 1) {
      winner = contenders[0];
      console.log(winner.getName() + ' has the highest high pair');
      return winner;
    } else {
      isHighPairTie = true;
    }
  }

  if (isHighPairTie) {
    // Compare players second pair (low pairs)
    for (const player of contenders) {
      console.log(
        player.getName() + "'s low pair value: " + player.getLowPairValue()
      );
    }
    if (
      contenders.every(
        (player) => player.getLowPairValue() === contenders[0].getLowPairValue()
      )
    ) {
      isLowPairTie = true;
      console.log('Identical low pairs');
    }

    if (!isLowPairTie) {
      console.log('There is not a tie between the low pairs');
      const highestLowPairValue = Math.max(
        ...contenders.map((player) => player.getLowPairValue())
      );

      contenders = contenders.filter(
        (player) => player.getLowPairValue() === highestLowPairValue
      );
      if (contenders.length === 1) {
        winner = contenders[0];
        console.log(winner.getName() + ' has the higehst low pair');
        return winner;
      } else {
        isLowPairTie = true;
        console.log('Players with the highest low pair value:', contenders);
      }
    }
  }

  if (isHighPairTie && isLowPairTie) {
    // It's a tie
    return compareKickers(contenders);
  }
}

function compareThreeOfAKinds(contenders) {
  console.log('Comparing three of a kind...');

  let winner;
  let isTie = false;

  contenders.forEach((player) => {
    player.setThreeOfAKindValue([...new Set(player.getThreeOfAKindValue())]);
  });

  if (
    // Check if all players have the same three of a kind
    contenders.every(
      (player) =>
        player.getThreeOfAKindValue()[0] ===
        contenders[0].getThreeOfAKindValue()
    )
  ) {
    isTie = true;
    console.log('Identical three of a kinds');
  }

  if (!isTie) {
    const highestThreeOfAKindValue = Math.max(
      // What the higehst three of a kind value is
      ...contenders.map((player) => player.getThreeOfAKindValue()[0])
    );

    contenders = contenders.filter(
      (player) => player.getThreeOfAKindValue()[0] === highestThreeOfAKindValue // Include only players with the highest three of a kind value
    );

    if (contenders.length === 1) {
      winner = contenders[0];
      console.log(winner.getName() + ' has the highest three of a kind');
      return winner;
    } else {
      isTie = true;
    }
  }

  if (isTie) {
    console.log('Three of a kind tie');
    return compareKickers(contenders);
  }
}

// Same as compareStraights probably delete
function compareStraightFlushes(contenders) {
  console.log('Comparing straights flushes...');

  let winner;
  let isStraightFlushTie = false;

  if (
    contenders.every(
      (player) =>
        JSON.stringify(player.getStraightFlushValues()) ===
        JSON.stringify(contenders[0].getStraightFlushValues())
    )
  ) {
    console.log('All players straight flushes were the same');
    return contenders; // It's a tie
  }

  if (!isStraightFlushTie) {
    const highestStraightFlushValue = Math.max(
      ...contenders.map((player) => player.getStraightFlushValues()[0])
    );

    console.log('Highest straight value:' + highestStraightFlushValue);

    contenders = contenders.filter(
      (player) =>
        player.getStraightFlushValues()[0] === highestStraightFlushValue // Include only players with the highest straight value
    );

    if (contenders.length === 1) {
      winner = contenders[0];
      console.log(winner.getName() + ' has the highest straight flush');
      return winner;
    } else {
      // No need to check for kickers since a straight = full poker hand
      return contenders;
    }
  }
}

function compareStraights(contenders) {
  console.log('Comparing straights...');

  let winner;
  let isStraightTie = false;

  if (
    contenders.every(
      (player) =>
        JSON.stringify(player.getStraightValue()) ===
        JSON.stringify(contenders[0].getStraightValue())
    )
  ) {
    console.log('All players straights were the same');
    return contenders; // It's a tie
  }

  if (!isStraightTie) {
    const highestStraightValue = Math.max(
      ...contenders.map((player) => player.getStraightValue()[0])
    );

    console.log('Highest straight value:' + highestStraightValue);

    contenders = contenders.filter(
      (player) => player.getStraightValue()[0] === highestStraightValue // Include only players with the highest straight value
    );

    if (contenders.length === 1) {
      winner = contenders[0];
      console.log(winner.getName() + ' has the highest straight');
      return winner;
    } else {
      // No need to check for kickers since a straight = full poker hand
      return contenders;
    }
  }
}

function compareFlushes(contenders) {
  let highestFlushValueIndex = 0;

  for (let i = 1; i < contenders.length; i++) {
    for (let j = 0; j < 5; j++) {
      if (
        contenders[i].getFlushValue()[j] >
        contenders[highestFlushValueIndex].getFlushValue()[j]
      ) {
        highestFlushValueIndex = i;
        break; // Move on to the next player once we find a higher value
      } else if (
        contenders[i].getFlushValue()[j] <
        contenders[highestFlushValueIndex].getFlushValue()[j]
      ) {
        break; // Move on to the next player once we find a lower value
      }
    }
  }

  const winner = contenders[highestFlushValueIndex];

  // Check for ties
  const tiedPlayers = contenders.filter((player, index) => {
    return (
      index !== highestFlushValueIndex &&
      JSON.stringify(player.getFlushValue()) ===
        JSON.stringify(winner.getFlushValue())
    );
  });

  if (tiedPlayers.length > 0) {
    console.log('Flush tie between:');
    tiedPlayers.forEach((player) => {
      console.log(player.getName());
    });
    return tiedPlayers.concat(winner);
  }

  console.log(winner.getName() + ' wins');
  console.log(winner.getFlushValue());
  return winner;
}

function compareFullHouses(contenders) {
  console.log('Comparing three of a kind...');

  let winner;
  let isTie = false;

  contenders.forEach((player) => {
    player.setThreeOfAKindValue([...new Set(player.getThreeOfAKindValue())]);
  });

  if (
    contenders.every(
      (player) =>
        JSON.stringify(player.getThreeOfAKindValue()) ===
        JSON.stringify(contenders[0].getThreeOfAKindValue())
    )
  ) {
    console.log('Full House: Three Of A Kind Tie');
    return compareOnePairs(contenders);
  }
  const highestThreeOfAKindValue = Math.max(
    // What the higehst three of a kind value is
    ...contenders.map((player) => player.getThreeOfAKindValue())
  );

  contenders = contenders.filter(
    (player) => player.getThreeOfAKindValue() === highestThreeOfAKindValue // Include only players with the highest three of a kind value
  );

  if (contenders.length === 1) {
    winner = contenders[0];
    console.log(winner.getName() + ' has the highest three of a kind');
    return winner;
  }

  return compareOnePairs(contenders);
}
// Same as compareThreeOfAKind probably delete
function compareFourOfAKinds(contenders) {
  console.log('Comparing four of a kind...');

  let winner;
  let isTie = false;

  contenders.forEach((player) => {
    player.setFourOfAKindValue([...new Set(player.getFourOfAKindValue())]);
  });

  if (
    // Check if all players have the same three of a kind
    contenders.every(
      (player) =>
        player.getFourOfAKindValue()[0] === contenders[0].getFourOfAKindValue()
    )
  ) {
    isTie = true;
    console.log('Identical four of a kinds');
  }

  if (!isTie) {
    const highestFourOfAKindValue = Math.max(
      // What the higehst three of a kind value is
      ...contenders.map((player) => player.getFourOfAKindValue()[0])
    );

    contenders = contenders.filter(
      (player) => player.getFourOfAKindValue()[0] === highestFourOfAKindValue // Include only players with the highest three of a kind value
    );

    if (contenders.length === 1) {
      winner = contenders[0];
      console.log(winner.getName() + ' has the highest four of a kind');
      return winner;
    } else {
      isTie = true;
    }
  }

  if (isTie) {
    console.log('Four of a kind tie');
    return compareKickers(contenders);
  }
}

// Compare kicker values in case of ties
function compareKickers(contenders) {
  console.log('Comparing kickers...');

  contenders.forEach((player) => {
    console.log(player.getName() + "'s kickers: " + player.getKickers());
  });

  let highestKickerValue = 0;
  let kickersLength = contenders[0].getKickers().length; // Assumes all players have same kickers.length

  if (
    // Check if all kickers are same
    contenders.every(
      (player) =>
        JSON.stringify(player.getKickers()) ===
        JSON.stringify(contenders[0].getKickers())
    )
  ) {
    console.log('All players kickers were the same');
    return contenders; // It's a tie
  }

  for (let i = 0; i < kickersLength; i++) {
    const highestValue = Math.max(
      ...contenders.map((player) => player.getKickers()[i])
    );
    highestKickerValue = Math.max(highestValue, highestKickerValue);
  }

  console.log('Highest kicker value: ' + highestKickerValue);

  contenders = contenders.filter(
    // Only include players who has this value
    (player) => player.getKickers()[0] === highestKickerValue
  );

  if (contenders.length === 1) {
    // If only one player = winner
    return contenders[0];
  }

  const remainingKickersLength = contenders[0].getKickers().length;

  for (let i = 0; i < remainingKickersLength; i++) {
    let maxKickerValue = Math.max(
      ...contenders.map((player) => player.getKickers()[i])
    );

    contenders = contenders.filter(
      (player) => player.getKickers()[i] === maxKickerValue
    );

    if (contenders.length === 1) {
      return contenders[0];
    }
  }
  return contenders;
}

function setHighAndLowPairValue(contenders) {
  contenders.forEach((player) => {
    player.setUniquePairs([...new Set(player.getPairs())]); // Remove duplicates to make comparisons easier
    player.setHighPairValue(Math.max(...player.getUniquePairs()));
    if (player.getPairs().length == 4) {
      // If two pairs
      player.setLowPairValue(Math.min(...player.getUniquePairs()));
    }
  });
}

export { rankHandRanks };
