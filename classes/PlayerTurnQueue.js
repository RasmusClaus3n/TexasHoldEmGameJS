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
    delete this.items[this.frontIndex];
    this.frontIndex++;
    return item;
  }

  clearQueue() {
    this.items = {};
    this.frontIndex = 0;
    this.backIndex = 0;
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
    const cpuPlayers = [];
    for (let i = this.frontIndex; i < this.backIndex; i++) {
      const player = this.items[i];
      if (!player.isMainPlayer) {
        cpuPlayers.push(player);
      }
    }
    return cpuPlayers;
  }

  getAllPlayersFromQ() {
    const players = Object.values(this.items);
    return players.filter((player) => player);
  }

  getPlayersWhoHaveCalled() {
    const players = Object.values(this.items);
    return players.filter((player) => player && player.hasCalled);
  }
  getPlayersWhoRaised() {
    const players = Object.values(this.items);
    return players.filter((player) => player && player.hasRaised);
  }

  allPlayersHaveCalled() {
    const players = Object.values(this.items);
    return players.every((player) => player && player.hasCalled);
  }

  anyPlayerHasRaised() {
    const players = Object.values(this.items);
    const playersWithRaise = players.filter(
      (player) => player && player.hasRaised
    );
    return playersWithRaise.length > 0; // Returns true if any player has raised, otherwise false
  }

  allOtherPlayersHaveCalled(currentPlayer) {
    const players = Object.values(this.items);
    return players
      .filter(
        (player) => player && player.getName() !== currentPlayer.getName()
      )
      .every((player) => player.hasCalled);
  }

  get printQueue() {
    return this.items;
  }
}

export default PlayerTurnQueue;
