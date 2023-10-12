import Player from './Player.js';

let isWinner = false;

function rankHandRanks(player, cpuPlayers) {
  const allPlayers = [player, ...cpuPlayers];
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
      break;
    case 2:
      console.log('One Pair Tie');
      return compareOnePairs(contenders);
      break;
    case 3:
      console.log('Two Pairs Tie');
      return compareTwoPairs(contenders);
      break;
    case 4:
      console.log('Three Of A Kind Tie');
      return compareThreeOfAKinds(contenders);
      break;
    case 5:
      console.log('Straight Tie');
      return compareStraights(contenders);
      break;
    case 6:
      console.log('Flush Tie');
      break;
    case 7:
      console.log('Full House Tie');
      break;
    case 8:
      console.log('Four Of A Kind Tie');
      break;
    case 9:
      console.log('Straight Flush Tie');
      break;
    // Add more cases as needed
    default:
      console.log('Unknown highestHandRank');
      break;
  }
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

  if (isPairTie) {
    console.log("It's a pair tie");
    return compareKickers(contenders);
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
      console.log(winner.getName() + ' has the highest high pair');
      return winner;
    } else {
      isTie = true;
    }
  }

  if (isTie) {
    console.log(contenders[0] + ' this runs :|');
    return compareKickers(contenders);
  }
}

function compareStraights(contenders) {
  console.log('Comparing straights...');

  let winner;
  let isStraightTie = false;

  if (
    // Check if all players have the same straight
    contenders.every(
      (player) =>
        player.getStraightValue()[0] === contenders[0].getStraightValue()[0]
    )
  ) {
    isStraightTie = true;
    console.log('Identical straights');
  }

  if (!isStraightTie) {
    const highestStraightValue = Math.max(
      // What the higehst straight value is
      ...contenders.map((player) => player.getStraightValue()[0])
    );

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

// Compare kicker values in case of ties
function compareKickers(contenders) {
  console.log('Comparing kickers...');

  let winner;
  let isTie = true;
  let highestKickerValue = 0;
  let kickersLength = contenders[0].getKickers().length; // Assumes all players have same kickers.length

  if (
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

  console.log('Highest kicker value:' + highestKickerValue);

  contenders = contenders.filter(
    (player) => player.getKickers()[0] === highestKickerValue // Only include players who has this value
  );

  if (contenders.length === 1) {
    // If only one player = winner
    return contenders[0];
  }

  const remainingKickersLength = contenders[0].getKickers().length;

  // Maybe only need this part?
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

function yeOld() {
  function compareKickers(contenders) {
    console.log('Comparing kickers...');

    let winner;
    let isTie = true;

    for (let i = 0; i < contenders[0].getKickers().length; i++) {
      const highestKickerValue = Math.max(
        ...contenders.map((player) => player.getKickers()[i])
      );

      if (
        contenders.every(
          (player) => player.getKickers()[i] === contenders[0].getKickers()[i]
        )
      ) {
        isTie = true; // All players have the same kicker at index 'i'
      } else {
        // There's a player with a higher kicker at index 'i'
        winner = contenders.find(
          (player) => player.getKickers()[i] === highestKickerValue
        );
        if (contenders.length === 1) {
          return winner;
        }
      }
    }

    if (!isTie) {
      console.log(winner.getName() + ' is the winner');
      return winner;
    } else {
      console.log('After comparing kickers it is a tie between:');
      for (const player of contenders) {
        console.log(player.getName());
      }
      return contenders;
    }
  }
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
