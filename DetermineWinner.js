import Player from './Player.js';

let isWinner = false;

function rankHandValues(player, cpuPlayers) {
  let allHandValues = []; // Helper array to gather all handRanks
  let allPlayers = [player, ...cpuPlayers];
  let winner;

  for (let player of allPlayers) {
    allHandValues.push(player.getHandValue()); // Gathers all handRanks in one array
  }

  const highestHandValue = Math.max(...allHandValues); // Determines the highest handRank

  console.log('Highest hand rank: ' + highestHandValue);

  const contenders = allPlayers.filter(
    // Sets an array that contains all the players who has the highest handRank
    (player) => player.getHandValue() === highestHandValue
  );

  console.log('Highest hand rank after filter: ' + highestHandValue);

  console.log('contenders.length: ' + contenders.length);

  if (contenders.length === 1) {
    // If there's only one player in this array a winner is determined
    winner = contenders[0];
    if (winner) {
      console.log('The winner is: ' + winner.getName());
    }
  } else if (contenders.length > 1) {
    // Else things get complicated
    if (highestHandValue === 3) {
      winner = comparePairs(contenders);

      if (Array.isArray(winner)) {
        console.log("It's a tie! Winners: ");
        for (const player of winner) {
          console.log(player.getName());
        }
      } else {
        console.log(winner.getName() + ' is le winner');
      }
    }
  }
}

function comparePairs(contenders) {
  let winner;
  let isHighPairTie = false;
  let isLowPairTie = false;

  contenders.forEach((player) => {
    player.setUniquePairs([...new Set(player.getPairs())]);
    player.setHighPairValue(Math.max(...player.getUniquePairs()));
    player.setLowPairValue(Math.min(...player.getUniquePairs()));
  });

  if (
    contenders.every(
      (player) => player.getHighPairValue() === contenders[0].getHighPairValue()
    )
  ) {
    isHighPairTie = true;
  }

  if (
    contenders.every(
      (player) => player.getLowPairValue() === contenders[0].getLowPairValue()
    )
  ) {
    isLowPairTie = true;
  }

  if (isHighPairTie) {
    if (!isLowPairTie) {
      winner = contenders.reduce((prev, current) => {
        if (prev.getHighPairValue() === current.getHighPairValue()) {
          return prev.getLowPairValue() > current.getLowPairValue()
            ? prev
            : current;
        }
        return prev.getHighPairValue() > current.getHighPairValue()
          ? prev
          : current;
      });
    }
  }

  if (isHighPairTie && isLowPairTie) {
    console.log("It's a tie!");
    return compareKickers(contenders);
  }

  return winner;
}

// Compare kicker values in case of ties
function compareKickers(contenders) {
  console.log('comparing kickers...');

  for (let i = 0; i < contenders[0].kickers.length; i++) {
    const firstPlayerKicker = contenders[0].kickers[i];

    if (contenders.some((player) => player.kickers[i] !== firstPlayerKicker)) {
      contenders.sort((a, b) => b.kickers[i] - a.kickers[i]);
      return contenders[0];
    }
  }

  console.log("It's a tie!");
  return contenders;
}

export { rankHandValues };
