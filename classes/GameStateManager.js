class GameStateManager {
  constructor() {
    this._deck = [];
    this._comCards = [];
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
}

export default GameStateManager;
