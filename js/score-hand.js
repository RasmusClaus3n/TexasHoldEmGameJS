import {
  hasOnePair,
  hasTwoPair,
  hasThreeOfAKind,
  hasFlush,
  hasStraight,
  hasLowStraight,
  hasFourOfAKind,
  hasStraightFlush,
  hasLowStraightFlush,
  findKickers,
} from './evaluate-hand.js';

function scoreCards(comCards, player) {
  let resultCards = [...comCards, ...player.getHand()];
  player.setResultCards(resultCards);

  if (
    hasStraightFlush(resultCards, player) ||
    hasLowStraightFlush(resultCards, player)
  ) {
    player.setHandRankName('Straight Flush');
    return 9;
  } else if (hasFourOfAKind(resultCards, player)) {
    player.setHandRankName('Quads');
    return 8;
  } else if (
    hasThreeOfAKind(resultCards, player) &&
    hasOnePair(resultCards, player)
  ) {
    player.setHandRankName('Full House');
    return 7;
  } else if (hasFlush(resultCards, player)) {
    player.setHandRankName('Flush');
    return 6;
  } else if (
    hasLowStraight(resultCards, player) ||
    hasStraight(resultCards, player)
  ) {
    player.setHandRankName('Straight');
    return 5;
  } else if (hasThreeOfAKind(resultCards, player)) {
    player.setHandRankName('Trips');
    return 4;
  } else if (hasTwoPair(resultCards, player)) {
    player.setHandRankName('Two Pair');
    return 3;
  } else if (hasOnePair(resultCards, player)) {
    player.setHandRankName('Pair');
    return 2;
  }

  // BAD
  const highCard = setHighCard(resultCards);
  player.setHandRankName('High Card');
  player.setHighCard(highCard);
  player.setKickers(findKickers(resultCards, highCard, player));
  return 1;
}

// BAD
function setHighCard(resultCards) {
  let cardVals = [];

  resultCards.forEach((card) => {
    cardVals.push(card.getValue());
  });

  const highCard = Math.max(...cardVals);
  cardVals = [];
  cardVals.push(highCard);
  return cardVals;
}

function setHandRanks(mainPlayer, cpuPlayers, comCards) {
  mainPlayer.setHandRank(scoreCards(comCards, mainPlayer));
  for (let cpu of cpuPlayers) {
    cpu.setHandRank(scoreCards(comCards, cpu));
  }
}

export { scoreCards, setHandRanks };
