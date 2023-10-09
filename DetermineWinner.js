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
    if (highestHandValue === 2) {
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
  } else {
    // If there's two or more players that have the same high pair we instead determine who has the highest among the second pair (i.e. the lower pair)

    for (const player of contenders) {
      minPairsArr.push(Math.min(...player.getPairs()));
    }
  }

  console.log(playerWithHighestPair);
  return playerWithHighestPair;
}

export { rankHandValues };
