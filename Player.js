class Player {
  constructor(
    name,
    hand,
    money,
    handValue,
    handPoints,
    pairs,
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
    this.handPoints = handPoints;
    this.pairs = pairs;
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
  getHandPoints() {
    return this.handPoints;
  }
  setHandPoints(handPoints) {
    this.handPoints = handPoints;
  }
  getPairs() {
    return this.pairs;
  }
  setPairs(pairs) {
    this.pairs = pairs;
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
