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

function scoreCards(comCards, playerCards) {
  let resultCards = [...comCards, ...playerCards];

  if (hasStraightFlush(resultCards) || hasLowStraightFlush(resultCards)) {
    return 9;
  } else if (hasFourOfAKind(resultCards)) {
    return 8;
  } else if (hasThreeOfAKind(resultCards) && hasOnePair(resultCards)) {
    return 7;
  } else if (hasFlush(resultCards)) {
    return 6;
  } else if (hasLowStraight(resultCards) || hasStraight(resultCards)) {
    return 5;
  } else if (hasThreeOfAKind(resultCards)) {
    return 4;
  } else if (hasTwoPair(resultCards)) {
    return 3;
  } else if (hasOnePair(resultCards)) {
    return 2;
  }

  return 1;
}

export { scoreCards };
