const Game = require('./Game');

class Account {
  constructor(data) {
    this.name = data.name;
    this.gamesCount = 0;
    this.gameBans = [];

    this.games = [];

    this.idleStartTime = NaN;
    this.idleStatus = data.status;
  }

  update(data) {
    if (data.time) this.idleStartTime = data.time;
    if (data.status) this.idleStatus = data.status;
  }

  loadGames() {
    // todo: create games list
  }

  setBanned(gameIds) {
    this.gameBans = gameIds;
  }
}

module.exports = Account;
