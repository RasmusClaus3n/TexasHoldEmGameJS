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
        winner = comparePairs(contenders);
        console.log(winner.getName() + ' is le winner');
      }
    }
  }
}

function comparePairs(contenders) {
  let winner;
  let isHighPairTie = false;
  let isLowPairTie = false;

  // Loops through all the players and create arrays that are destructured sets
  // No duplicates are allowed so we get the unique pair values
  contenders.forEach((player) => {
    player.setUniquePairs([...new Set(player.getPairs())]);
    // Gets max value in uniquePairs array and set it to highPairValue
    player.setHighPairValue(Math.max(...player.getUniquePairs()));
    // Do the same for min value and set it to lowPairValue attribute
    player.setLowPairValue(Math.min(...player.getUniquePairs()));
  });

  // Find the player with the highest highPairValue
  winner = contenders.reduce((prev, current) =>
    prev.getHighPairValue() > current.getHighPairValue() ? prev : current
  );

  if (
    contenders.every(
      (player) => player.getHighPairValue() === winner.getHighPairValue()
    )
  ) {
    console.log('All players have the same high pair value');
    isHighPairTie = true;
  }

  // Find the player with the highest lowPairValue
  if (!isHighPairTie) {
    winner = contenders.reduce((prev, current) =>
      prev.getLowPairValue() > current.getLowPairValue() ? prev : current
    );
  }

  if (
    contenders.every(
      (player) => player.getLowPairValue() === winner.getLowPairValue()
    )
  ) {
    console.log('All players have the same low pair value');
    isLowPairTie = true;
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
  let isTie = true; // Assuming it's a tie by default

  // To compare with all kicker values with each other we loop over the players x amount of times where x is kickers.length. It is assumed that all players have the same amount of kickers in this situation.
  for (let i = 0; i < contenders[0].kickers.length; i++) {
    const firstPlayerKicker = contenders[0].kickers[i]; // Used to compare with the kickers of other players.

    for (const player of contenders) {
      if (player.kickers[i] !== firstPlayerKicker) {
        // This will determine if all kickers are the same
        isTie = false; // If not there's not a tie and we break out of the loop
        break;
      }
    }

    if (!isTie) {
      console.log('Not a tie');
      // If it's determined that there's not a tie we compare the kicker values
      contenders.sort(
        (playerA, playerB) => playerA.kickers[i] - playerB.kickers[i]
      );
      return contenders[0];
    }
  }

  if (isTie) {
    console.log("It's a tie!");
    return contenders;
  }
}

export { rankHandValues };
