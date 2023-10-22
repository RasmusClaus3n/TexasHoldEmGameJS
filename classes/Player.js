class Player {
  constructor(
    name,
    hand,
    money,
    handRank,
    handRankName,
    resultCards,
    pokerHand,
    kickers,
    highCard,
    pairs,
    uniquePairs,

    isActive,
    isBust,

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
    this.handRank = handRank;
    this.handRankName = handRankName;
    this.resultCards = resultCards;
    this.pokerHand = pokerHand;
    this.kickers = kickers;
    this.highCard = highCard;
    this.pairs = pairs;
    this.uniquePairs = uniquePairs;

    this.isActive = true;
    this.isBust = false;

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
  getHandRank() {
    return this.handRank;
  }
  setHandRank(handRank) {
    this.handRank = handRank;
  }
  getHandRankName() {
    return this.handRankName;
  }
  setHandRankName(handRankName) {
    this.handRankName = handRankName;
  }
  getResultCards() {
    return this.resultCards;
  }
  setResultCards(resultCards) {
    this.resultCards = resultCards;
  }
  getPokerHand() {
    return this.pokerHand;
  }
  setPokerHand(pokerHand) {
    this.pokerHand = pokerHand;
  }
  getKickers() {
    return this.kickers;
  }
  setKickers(kickers) {
    this.kickers = kickers;
  }
  getHighCard() {
    return this.highCard;
  }
  setHighCard(highCard) {
    this.highCard = highCard;
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

  getIsActive() {
    return this.isActive;
  }
  setIsActive(isActive) {
    this.isActive = isActive;
  }
  getIsBust() {
    return this.isBust;
  }
  setIsBust(isBust) {
    this.isBust = isBust;
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
  getStraightFlushValues() {
    return this.straightFlushValue;
  }
  setStraightFlushValues(straightFlushValue) {
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
