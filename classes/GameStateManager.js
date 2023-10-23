import Player from '../classes/Player.js';

class GameStateManager {
  constructor() {
    this.allPlayers = []; // Add a new attribute to store all players
    this.cpuPlayers = [];
    this.mainPlayer = null;
    this.activePlayers = [];
  }

  addMainPlayer(player) {
    this.mainPlayer = player;
    this.allPlayers.push(player); // Add player to allPlayers
  }

  addCpuPlayer(player) {
    this.cpuPlayers.push(player);
    this.allPlayers.push(player); // Add player to allPlayers
  }

  setActive(player, isActive) {
    player.setIsActive(isActive);

    this.activePlayers = [...this.cpuPlayers, this.mainPlayer].filter(
      (player) => player.getIsActive()
    );
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
