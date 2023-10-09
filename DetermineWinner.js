import Player from './Player.js';

let isWinner = false;

function rankHandValues(player, cpuPlayers) {
  let allHandValues = [];
  let allPlayers = [player, ...cpuPlayers];

  for (let player of allPlayers) {
    allHandValues.push(player.getHandValue());
  }

  const highestHandValue = Math.max(...allHandValues);

  const contenders = allPlayers.filter(
    (player) => player.getHandValue() === highestHandValue
  );

  if (contenders.length === 1) {
    console.log(`${contenders[0].getName()} is the winner ${highestHandValue}`);
  } else {
    if (highestHandValue === 3) {
      compareMaxPairs(contenders);
    }
  }
}

function compareMaxPairs(contenders) {
  let highestPairValue = 0;
  let playerWithHighestPair; // This will be the winner if there's not a tie

  let maxPairsArr = []; // This will contain the highest pair value between the two pairs
  let minPairsArr = []; // This will contain the lowest pair value between the two pairs

  let pairFinalContenders = []; // If there is two or more players that has the same pair they will be placed here

  for (const player of contenders) {
    // Takes the highest pair value and puts them in the maxPairsArr
    maxPairsArr.push(Math.max(...player.getPairs()));
  }

  highestPairValue = Math.max(...maxPairsArr); // The highest pair value is determined

  console.log('Highest pair value: ' + highestPairValue);

  for (const player of contenders) {
    // If there is a player that has the highest pair value (it's always going to be at least one) it gets put in the pairFinalContenders array

    const pairValue = Math.max(...player.getPairs());

    if (pairValue === highestPairValue) {
      pairFinalContenders.push(player);
    }
  }

  if (pairFinalContenders.length === 1) {
    // Only one player has the highest pair. No further analyzing is needed.
    playerWithHighestPair = pairFinalContenders[0];
  } else if (pairFinalContenders.length > 1) {
    // If there's two or more players that have the same high pair we instead determine who has the highest among the second pair (i.e. the lower pair)

    pairFinalContenders = []; // Start with clearing the pairFinalContenders array

    for (const player of contenders) {
      minPairsArr.push(Math.min(...player.getPairs()));
    }

    highestPairValue = Math.max(...minPairsArr); // The highest pair value is determined

    for (const player of contenders) {
      // We do the same thing as before only look for the min value instead
      const pairValue = Math.min(...player.getPairs());

      if (pairValue === highestPairValue) {
        pairFinalContenders.push(player);
      }
    }

    if (pairFinalContenders.length === 1) {
      // Only one player has the highest pair. No further analyzing is needed.
      playerWithHighestPair = pairFinalContenders[0];
    } else if (pairFinalContenders.length > 1) {
      // This means two or more players have the exact same hand so next we determine who has the better kicker.

      // At last we determine that there is a tie and return
      console.log('TIE');
      console.log(pairFinalContenders);
    }
  }

  console.log(playerWithHighestPair);
  return playerWithHighestPair;
}

export { rankHandValues };
