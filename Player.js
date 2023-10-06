class Player {
  constructor(name, hand, money, handValue, handPoints) {
    this.name = name;
    this.hand = hand;
    this.money = money;
    this.handValue = handValue;
    this.handPoints = handPoints;
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
}

export default Player;
