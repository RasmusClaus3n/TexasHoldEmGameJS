class GameStateManager {
  constructor() {
    this._deck = [];
    this._comCards = [];
    this._stage = 0;
  }

  get deck() {
    return this._deck;
  }

  set deck(newDeck) {
    this._deck = newDeck;
  }

  get comCards() {
    return this._comCards;
  }

  set comCards(newComCards) {
    this._comCards = newComCards;
  }

  get stage() {
    return this._stage;
  }

  set stage(newStage) {
    this._stage = newStage;
  }

  increaseStage() {
    this._stage += 1;
  }
}

export default GameStateManager;
