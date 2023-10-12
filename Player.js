class Player {
  constructor(
    name,
    hand,
    money,
    handValue,
    handRankName,
    handPoints,
    resultCards,
    kickers,
    pairs,
    uniquePairs,
    highPairValue,
    lowPairValue,
    threeOfAKindValue,
    fourOfAKindValue,
    straightValue,
    straightFlushValue,
    flushValue
  ) {
    this.name = name;
    this.hand = hand;
    this.money = money;
    this.handValue = handValue;
    this.handRankName = handRankName;
    this.handPoints = handPoints;
    this.resultCards = resultCards;
    this.kickers = kickers;
    this.pairs = pairs;
    this.uniquePairs = uniquePairs;
    this.highPairValue = highPairValue;
    this.lowPairValue = lowPairValue;
    this.threeOfAKindValue = threeOfAKindValue;
    this.fourOfAKindValue = fourOfAKindValue;
    this.straightValue = straightValue;
    this.straightFlushValue = straightFlushValue;
    this.flushValue = flushValue;
  }

  getName() {
    return this.name;
  }
  setName(name) {
    this.name = name;
  }
  getHand() {
    return this.hand;
  }
  setHand(hand) {
    this.hand = hand;
  }
  getMoney() {
    return this.money;
  }
  setMoney(money) {
    this.money = money;
  }
  getHandValue() {
    return this.handValue;
  }
  setHandValue(handValue) {
    this.handValue = handValue;
  }
  getHandRankName() {
    return this.handRankName;
  }
  setHandRankName(handRankName) {
    this.handRankName = handRankName;
  }
  getHandPoints() {
    return this.handPoints;
  }
  setHandPoints(handPoints) {
    this.handPoints = handPoints;
  }
  getResultCards() {
    return this.resultCards;
  }
  setResultCards(resultCards) {
    this.resultCards = resultCards;
  }
  getKickers() {
    return this.kickers;
  }
  setKickers(kickers) {
    this.kickers = kickers;
  }
  getPairs() {
    return this.pairs;
  }
  setPairs(pairs) {
    this.pairs = pairs;
  }
  getUniquePairs() {
    return this.uniquePairs;
  }
  setUniquePairs(uniquePairs) {
    this.uniquePairs = uniquePairs;
  }
  getHighPairValue() {
    return this.highPairValue;
  }
  setHighPairValue(highPairValue) {
    this.highPairValue = highPairValue;
  }
  getLowPairValue() {
    return this.lowPairValue;
  }
  setLowPairValue(lowPairValue) {
    this.lowPairValue = lowPairValue;
  }
  getThreeOfAKindValue() {
    return this.threeOfAKindValue;
  }
  setThreeOfAKindValue(threeOfAKindValue) {
    this.threeOfAKindValue = threeOfAKindValue;
  }
  getFourOfAKindValue() {
    return this.fourOfAKindValue;
  }
  setFourOfAKindValue(fourOfAKindValue) {
    this.fourOfAKindValue = fourOfAKindValue;
  }
  getStraightValue() {
    return this.straightValue;
  }
  setStraightValue(straightValue) {
    this.straightValue = straightValue;
  }
  getStraightFlushValue() {
    return this.straightFlushValue;
  }
  setStraightFlushValue(straightFlushValue) {
    this.straightFlushValue = straightFlushValue;
  }
  getFlushValue() {
    return this.flushValue;
  }
  setFlushValue(flushValue) {
    this.flushValue = flushValue;
  }
}

export default Player;
