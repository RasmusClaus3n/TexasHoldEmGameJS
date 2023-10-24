class PlayerTurnQueue {
  constructor() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
  }

  enqueue(player) {
    if (player.isActive) {
      this.items[this.backIndex] = player;
      this.backIndex++;
      console.log(`Player ${player.getName()} was queued.`);
      return player + ' inserted';
    } else {
      console.log(
        `Player ${player.getName()} is not active and cannot be enqueued.`
      );
      return null;
    }
  }

  dequeue() {
    const item = this.items[this.frontIndex];
    console.log(`Player ${item.getName()} was dequeued.`);
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

  getMainPlayerFromQ() {
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      const player = this.items[i];
      if (player.isMainPlayer) {
        return player;
      }
    }
    return null; // Return null if main player not found
  }

  getCpuPlayersFromQ() {
    const otherPlayers = [];
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      const player = this.items[i];
      if (!player.isMainPlayer) {
        otherPlayers.push(player);
      }
    }
    return otherPlayers;
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

  get printQueue() {
    return this.items;
  }
}

export default PlayerTurnQueue;
