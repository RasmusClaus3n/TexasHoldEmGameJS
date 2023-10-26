class GameStateManager {
  constructor() {
    this._deck = [];
    this._comCards = [];
    this._mainPlayer = null;
    this._cpuPlayers = [];
    this._allPlayers = [];
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

  get mainPlayer() {
    return this._mainPlayer;
  }

  set mainPlayer(player) {
    this._mainPlayer = player;
  }

  get cpuPlayers() {
    return this._cpuPlayers;
  }

  set cpuPlayers(players) {
    this._cpuPlayers = players;
  }

  get allPlayers() {
    return this._allPlayers;
  }

  setAllPlayers(players) {
    this._allPlayers = players;
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
