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
      return compareOnePair(contenders);
      break;
    case 3:
      console.log('Two Pairs Tie');
      return compareTwoPairs(contenders);
      break;
    case 4:
      console.log('Three Of A Kind Tie');
      break;
    case 5:
      console.log('Straight Tie');
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

function compareOnePair(contenders) {
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
    console.log('identical high pairs');
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
      compareKickers(contenders);
    }
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
    console.log('identical high pairs');
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
    console.log('this runs');
    if (
      contenders.every(
        (player) => player.getLowPairValue() === contenders[0].getLowPairValue()
      )
    ) {
      isLowPairTie = true;
      console.log('identical low pairs');
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

function setHighAndLowPairValue(contenders) {
  contenders.forEach((player) => {
    player.setUniquePairs([...new Set(player.getPairs())]); // Remove duplicates to make comparisons easier
    player.setHighPairValue(Math.max(...player.getUniquePairs()));
    if (player.getPairs().length == 2) {
      // If two pairs
      player.setLowPairValue(Math.min(...player.getUniquePairs()));
    }
  });
}

function compareHighPairs(contenders) {}

// Compare kicker values in case of ties
function compareKickers(contenders) {
  console.log('comparing kickers...');

  let winner;
  let isTie = true;

  for (let i = 0; i < contenders[0].getKickers().length; i++) {
    const highestKickerValue = Math.max(
      ...contenders.map((player) => player.getKickers()[i])
    );

    if (
      contenders.every(
        (player) => player.getKickers()[i] === highestKickerValue
      )
    ) {
      isTie = true; // All players have the same kicker at index 'i'
    } else {
      isTie = false; // There's a player with a higher kicker at index 'i'
      winner = contenders.find(
        (player) => player.getKickers()[i] === highestKickerValue
      );
      break;
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

export { rankHandRanks };
