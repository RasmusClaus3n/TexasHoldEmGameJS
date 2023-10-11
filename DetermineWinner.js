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
    console.log(winner.getName() + ' wins!');
  } else if (contenders.length > 1) {
    // Else things get complicated
    if (highestHandValue === 3) {
      comparePairs(contenders);
    }
  }
}

function comparePairs(contenders) {
  console.log('comparing pairs...');
  let winner;
  let isHighPairTie = false;
  let isLowPairTie = false;

  contenders.forEach((player) => {
    player.setUniquePairs([...new Set(player.getPairs())]);
    player.setHighPairValue(Math.max(...player.getUniquePairs()));
    player.setLowPairValue(Math.min(...player.getUniquePairs()));
  });

  // Check if all players have the same high pair value
  if (
    contenders.every(
      (player) => player.getHighPairValue() === contenders[0].getHighPairValue()
    )
  ) {
    isHighPairTie = true;
    console.log('identical high pairs');
  }

  if (!isHighPairTie) {
    const highestHighPairValue = Math.max(
      ...contenders.map((player) => player.getHighPairValue())
    );

    contenders = contenders.filter(
      (player) => player.getHighPairValue() === highestHighPairValue
    );

    if (contenders.length === 1) {
      winner = contenders[0];
      console.log(winner.getName() + ' has the higehst pair');
      // return winner;
    } else {
      console.log('Players with the highest high pair value:', contenders);
      //check low pairs
    }
  }

  // Check if all players have the same low pair value
  if (
    contenders.every(
      (player) => player.getLowPairValue() === contenders[0].getLowPairValue()
    )
  ) {
    isLowPairTie = true;
    console.log('identical low pairs');
  }

  if (!isLowPairTie) {
  }

  if (isHighPairTie && isLowPairTie) {
    return compareKickers(contenders);
  }

  // Now you can use isHighPairTie and isLowPairTie for further processing
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

  console.log("It's a tie between the kickers");
  return contenders;
}

export { rankHandValues };
