import Player from './Player.js';

let isWinner = false;

function rankHandValues(player, cpuPlayers) {
  let allHandValues = [];
  let allPlayers = [player, ...cpuPlayers];
  let winner;

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
      console.log('hello');
    }
  }
}

function comparePairs(contenders) {
  let isTie = false;

  let highestPairValue = 0;
  let playerWithHighestPair; // This will be the winner if there's not a tie

  let maxPairsArr = []; // This will contain the highest pair value between the two pairs
  let minPairsArr = []; // This will contain the lowest pair value between the two pairs

  let tiedPlayers = []; // If there is two or more players that has the same pair they will be placed here

  for (const player of contenders) {
    // Takes the highest pair value and puts them in the maxPairsArr
    maxPairsArr.push(Math.max(...player.getPairs()));
  }

  highestPairValue = Math.max(...maxPairsArr); // The highest pair value is determined

  console.log('Highest pair value: ' + highestPairValue);

  for (const player of contenders) {
    // If there is a player that has the highest pair value (it's always going to be at least one) it gets put in the tiedPlayers array

    const pairValue = Math.max(...player.getPairs());

    if (pairValue === highestPairValue) {
      tiedPlayers.push(player);
    }
  }

  if (tiedPlayers.length === 1) {
    // Only one player has the highest pair. No further analyzing is needed.
    playerWithHighestPair = tiedPlayers[0];
    console.log('Winner: ' + playerWithHighestPair.getName());
  } else if (tiedPlayers.length > 1) {
    // If there's two or more players that have the same high pair we
    // instead determine who has the highest second pair
    // (i.e. the lower pair)

    tiedPlayers = []; // Start with clearing the tiedPlayers array

    for (const player of contenders) {
      minPairsArr.push(Math.min(...player.getPairs()));
    }

    highestPairValue = Math.max(...minPairsArr); // The highest pair value is determined

    for (const player of contenders) {
      // We do the same thing as before only look for the min value instead
      const pairValue = Math.min(...player.getPairs());

      if (pairValue === highestPairValue) {
        tiedPlayers.push(player);
      }
    }

    if (tiedPlayers.length === 1) {
      // Only one player has the highest pair. No further analyzing is needed.
      playerWithHighestPair = tiedPlayers[0];
    } else if (tiedPlayers.length > 1) {
      // Two or more players have the exact same two pairs so we determine who has the better kicker/kickers.

      for (const player of tiedPlayers) {
        let maxPairValue = Math.max(...player.getPairs());
        let minPairValue = Math.min(...player.getPairs());

        let resultCardsValues = [];
        let sum = 0;

        for (const card of player.getResultCards()) {
          resultCardsValues.push(card.getValue());
        }

        for (let i = resultCardsValues.length - 1; i >= 0; i--) {
          if (
            resultCardsValues[i] === maxPairValue ||
            resultCardsValues[i] === minPairValue
          ) {
            resultCardsValues.splice(i, 1);
          }
        }

        for (const value of resultCardsValues) {
          sum += value;
        }

        player.setHandPoints(sum);
        console.log(player.getName() + ' sum:' + player.getHandPoints());
      }

      playerWithHighestPair = tiedPlayers[0]; // Assuming the first player is the winner for now

      for (const player of tiedPlayers) {
        if (player.getHandPoints() > playerWithHighestPair.getHandPoints()) {
          playerWithHighestPair = player; // If a player has a higher hand points that player has the best kickers. A winner is determined.
        }
      }

      isTie = tiedPlayers.every(
        // Two or more player has the same kickers. No further tie breakers are applied and we determine there is a tie.
        (player) =>
          player.getHandPoints() === playerWithHighestPair.getHandPoints()
      );
    }

    if (isTie) {
      console.log(tiedPlayers);
      return console.log('TIE');
    }
  }
  console.log(playerWithHighestPair.getName() + ' wins');
  console.log(playerWithHighestPair);
  return playerWithHighestPair;
}

export { rankHandValues };
