import {
  hasOnePair,
  hasTwoPair,
  hasThreeOfAKind,
  hasFlush,
  hasStraight,
  hasFourOfAKind,
  hasStraightFlush,
} from './HandEvaluator.js';

const resultText = document.querySelector('.result h1');

function scoreCards(comCards, playerCards) {
  let handValue = 1;
  let returnMessage = '';

  let resultCards = [...comCards, ...playerCards];

  if (hasStraightFlush(resultCards)) {
    returnMessage = 'Straight Flush';
  } else if (hasFourOfAKind(resultCards)) {
    returnMessage = 'Four Of A Kind';
  } else if (hasThreeOfAKind(resultCards) && hasOnePair(resultCards)) {
    returnMessage = 'Full House';
  } else if (hasFlush(resultCards)) {
    returnMessage = 'Flush';
  } else if (hasThreeOfAKind(resultCards)) {
    returnMessage = 'Three Of A Kind';
  } else if (hasStraight(resultCards)) {
    returnMessage = 'Straight';
  } else if (hasTwoPair(resultCards)) {
    returnMessage = 'Two Pair';
  } else if (hasOnePair(resultCards)) {
    returnMessage = 'Pair';
  } else {
    returnMessage = 'High Card';
  }

  console.log(
    `Straight Flush ${hasStraightFlush(resultCards)}
Four Of A Kind: ${hasFourOfAKind(resultCards)}
Straight: ${hasStraight(resultCards)}
Flush: ${hasFlush(resultCards)}
Three Of A Kind: ${hasThreeOfAKind(resultCards)}
Two Pair: ${hasTwoPair(resultCards)}
One Pair: ${hasOnePair(resultCards)}`
  );

  resultText.textContent = returnMessage;

  return returnMessage;
}

export { scoreCards };
