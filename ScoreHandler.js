import {
  hasOnePair,
  hasTwoPair,
  hasThreeOfAKind,
  hasFlush,
  hasStraight,
  hasFourOfAKind,
  hasStraightFlush,
  hasLowStraightFlush,
  hasLowStraight,
} from './HandEvaluator.js';

function scoreCards(comCards, player) {
  let resultCards = [...comCards, ...player.getHand()];

  if (hasStraightFlush(resultCards) || hasLowStraightFlush(resultCards)) {
    return 9;
  } else if (hasFourOfAKind(resultCards, player)) {
    return 8;
  } else if (
    hasThreeOfAKind(resultCards, player) &&
    hasOnePair(resultCards, player)
  ) {
    return 7;
  } else if (
    hasFlush(resultCards, player) &&
    hasStraight(resultCards, player)
  ) {
    return 6;
  } else if (
    hasFlush(resultCards, player) &&
    hasLowStraight(resultCards, player)
  ) {
    return 6;
  } else if (hasFlush(resultCards, player)) {
    return 6;
  } else if (
    hasLowStraight(resultCards, player) ||
    hasStraight(resultCards, player)
  ) {
    return 5;
  } else if (hasThreeOfAKind(resultCards, player)) {
    return 4;
  } else if (hasTwoPair(resultCards, player)) {
    return 3;
  } else if (hasOnePair(resultCards, player)) {
    return 2;
  }

  return 1;
}

export { scoreCards };
