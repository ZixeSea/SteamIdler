const Game = require('./Game');

class Account {
  constructor(data) {
    this.name = data.name;
    this.gamesCount = 0;
    this.gameBans = [];

    this.games = [];

    this.idleRounds = 0;
    this.gamesIdled = 0;
    this.idleStartTime = NaN;
    this.idledForTime = NaN;
    this.idleStatus = data.status;
  }

  update(data) {
    if (data.time) this.idleStartTime = data.time;
    if (data.status) this.idleStatus = data.status;
    if (data.idled) this.idledForTime = Date.now() - this.idleStartTime;
  }

  IdleTimeInMs() {
    return Date.now() - this.idleStartTime;
  }

  addRound(games) {
    this.idleRounds++;
    this.gamesIdled += games;
  }

  loadGames(gamesList, blacklistGames) {
    const excludeGamesList = !blacklistGames ? [] : [].concat(blacklistGames, this.gameBans);
    gamesList.forEach((g) => {
      if (!excludeGamesList.includes(g.appid)) {
        this.games.push(new Game(g));
      }
    });
    this.gamesCount = gamesList.length;
  }

  setBanned(gameIds) {
    this.gameBans = gameIds;
  }
}

module.exports = Account;
