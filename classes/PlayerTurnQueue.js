class PlayerTurnQueue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }

  enqueue(item) {
    this.items[this.backIndex] = item;
    this.backIndex++;
    return item + ' inserted';
  }

  dequeue() {
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }

  getCurrentPlayer() {
    const index = this.frontIndex % this.backIndex; // Use modulo to loop
    return this.items[index];
  }

  getNextPlayer() {
    const nextIndex = (this.frontIndex + 1) % this.backIndex; // Use modulo to loop
    return this.items[nextIndex];
  }

  getPreviousPlayer() {
    const previousIndex =
      this.frontIndex - 1 < 0 ? this.backIndex - 1 : this.frontIndex - 1; // Handle wrap-around
    return this.items[previousIndex];
  }

  removeInactivePlayers() {
    const activeItems = {};

    for (let i = this.frontIndex; i < this.backIndex; i++) {
      const item = this.items[i];
      if (item.isActive) {
        activeItems[i] = item;
      }
    }

    this.items = activeItems;
    this.backIndex = this.frontIndex + Object.keys(activeItems).length;
  }

  allPlayersHaveCalled() {
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      const player = this.items[i];
      if (player && !player.hasCalled) {
        return false; // Found a player who hasn't called
      }
    }
    return true; // All players in the queue have called
  }

  anyCpuPlayerHasRaised() {
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      const currentPlayer = this.items[i];

      if (
        currentPlayer &&
        currentPlayer !== mainPlayer &&
        currentPlayer.hasRaised
      ) {
        return true; // Found a player (other than "You") who has raised
      }
    }
    return false; // No player (other than "You") in the queue has raised
  }

  hasMainPlayerRaised() {
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      const currentPlayer = this.items[i];
      if (
        currentPlayer &&
        currentPlayer.getName() === 'You' &&
        currentPlayer.hasRaised
      ) {
        return true; // The player named "You" has raised
      }
    }
    return false; // The player named "You" has not raised
  }

  get printQueue() {
    return this.items;
  }
}

export default PlayerTurnQueue;
