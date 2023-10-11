import Player from './Player.js';

let isWinner = false;

function rankHandValues(player, cpuPlayers) {
  const allPlayers = [player, ...cpuPlayers];
  const allHandValues = allPlayers.map((player) => player.getHandValue());
  const highestHandValue = Math.max(...allHandValues);
  const contenders = allPlayers.filter(
    (player) => player.getHandValue() === highestHandValue
  );

  if (contenders.length === 1) {
    const winner = contenders[0];
    console.log(`${winner.getName()} wins!`);
    return winner;
  }

  // Additional checks for specific highestHandValue scenarios
  switch (highestHandValue) {
    case 1:
      console.log('High Card Tie');
      break;
    case 2:
      console.log('One Pair Tie');
      break;
    case 3:
      console.log('Two Pairs Tie');
      comparePairs(contenders);
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
      console.log('Unknown highestHandValue');
      break;
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
      (player) => player.getHighPairValue() === highestHighPairValue // Filters the array to contain only players with the highest pair value
    );

    if (contenders.length === 1) {
      winner = contenders[0];
      console.log(winner.getName() + ' has the highest high pair');
      // return winner;
    } else {
      isHighPairTie = true;
      console.log('Players with the highest high pair value:', contenders);
      //check low pairs
    }
  }

  if (isHighPairTie) {
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
        (player) => player.getLowPairValue() === highestLowPairValue // Filters the array to contain only players with the highest low pair value
      );
      if (contenders.length === 1) {
        winner = contenders[0];
        console.log(winner.getName() + ' has the higehst low pair');
        // return winner;
      } else {
        isLowPairTie = true;
        console.log('Players with the highest low pair value:', contenders);
      }
    }
  }

  if (isHighPairTie && isLowPairTie) {
    compareKickers(contenders);
  }
}

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

export { rankHandValues };
