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

  loadGames(gamesList, blacklistGames) {
    const excludeGamesList = [].concat(blacklistGames, this.gameBans);
    gamesList.forEach((g) => {
      if (!excludeGamesList.includes(g.appid)) {
        this.games.push(new Game(g));
      }
    });
  }

  setBanned(gameIds) {
    this.gameBans = gameIds;
  }
}

module.exports = Account;
