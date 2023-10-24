import Player from '../classes/Player.js';

class GameStateManager {
  constructor() {
    this.allPlayers = [];
    this.cpuPlayers = [];
    this.mainPlayer = null;
    this.activePlayers = [];
  }

  addMainPlayer(player) {
    this.mainPlayer = player;
    this.allPlayers.push(player);
  }

  addCpuPlayer(player) {
    this.cpuPlayers.push(player);
    this.allPlayers.push(player);
  }

  setActive(player, isActive) {
    player.setIsActive(isActive);

    if (isActive && !this.activePlayers.includes(player)) {
      this.activePlayers.push(player);
    } else if (!isActive && this.activePlayers.includes(player)) {
      const index = this.activePlayers.indexOf(player);
      this.activePlayers.splice(index, 1);
    }
  }

  allPlayersHaveCalled() {
    return this.activePlayers.every((player) => player.hasCalled);
  }

  anyPlayersHasRaised() {
    return this.activePlayers.some((player) => player.hasRaised);
  }

  getMainPlayer() {
    return this.mainPlayer;
  }

  getCpuPlayers() {
    return this.cpuPlayers;
  }

  getActivePlayers() {
    return this.activePlayers;
  }

  getAllPlayers() {
    return this.allPlayers;
  }
}

export default GameStateManager;
