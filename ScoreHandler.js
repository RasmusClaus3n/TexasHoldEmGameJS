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
  let handValue = 1;

  let resultCards = [...comCards, ...playerCards];

  if (hasStraightFlush(resultCards) || hasLowStraightFlush(resultCards)) {
    return 'Straight Flush';
  } else if (hasFourOfAKind(resultCards)) {
    return 'Four Of A Kind';
  } else if (hasThreeOfAKind(resultCards) && hasOnePair(resultCards)) {
    return 'Full House';
  } else if (hasFlush(resultCards)) {
    return 'Flush';
  } else if (hasLowStraight(resultCards) || hasStraight(resultCards)) {
    return 'Straight';
  } else if (hasThreeOfAKind(resultCards)) {
    return 'Three Of A Kind';
  } else if (hasTwoPair(resultCards)) {
    return 'Two Pair';
  } else if (hasOnePair(resultCards)) {
    return 'Pair';
  }

  return 'High Card';
}

export { scoreCards };
