class BettingManager {
  constructor() {
    this.bigBlind = 5;
    this.smallBlind = 1;
    this.blindTurn = 0;
    this.pot = 0;
    this.currentBet = 0;
  }

  getPot() {
    return this.pot;
  }

  setCurrentBet(amount) {
    this.currentBet = amount;
    console.log('BM says current bet is: ' + amount);
  }

  getCurrentBet() {
    return this.currentBet;
  }

  getBigBlind() {
    return this.bigBlind;
  }

  getSmallBlind() {
    return this.smallBlind;
  }

  getBlindTurn() {
    return this.blindTurn;
  }

  setBlindTurn() {
    return this.blindTurn;
  }

  addToPot(amount) {
    this.pot += amount;
  }

  increaseBigBlind(amount) {
    this.bigBlind += amount;
  }

  increaseSmallBlind(amount) {
    this.bigBlind += amount;
  }

  increaseBlindTurn(increment) {
    this.blindTurn += increment;
  }
}

export default BettingManager;
