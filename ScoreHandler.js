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
} from './HandEvaluator.js';

function scoreCards(comCards, player) {
  let resultCards = [...comCards, ...player.getHand()];
  player.setResultCards(resultCards);

  if (hasStraightFlush(resultCards) || hasLowStraightFlush(resultCards)) {
    player.setHandRankName('Straight Flush');
    return 9;
  } else if (hasFourOfAKind(resultCards, player)) {
    player.setHandRankName('Four Of A Kind');
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
    player.setHandRankName('Three Of A Kind');
    return 4;
  } else if (hasTwoPair(resultCards, player)) {
    player.setHandRankName('Two Pair');
    return 3;
  } else if (hasOnePair(resultCards, player)) {
    player.setHandRankName('One Pair');
    return 2;
  }

  player.setHandRankName('High Card');
  return 1;
}

export { scoreCards };
