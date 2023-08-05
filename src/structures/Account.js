class Account {
  constructor(data) {
    this.isOnline = false;
    this.name = data.name;
    this.gamesCount = 0;
    this.bannedGames = [];
    this.blacklistedGames = [];

    this.games = [];

    this.idleStartTime = NaN;
    this.idleStatus = 'Unknown';
  }

  update(data) {
    if (data.time) this.idleStartTime = data.time;
    if (data.status) this.idleStatus = data.status;
  }

  login() {
    // todo: steam login code
    this.isOnline = true;
  }

  loadGames() {
    if (this.isOnline) return console.error(`Account not online`);
    // todo: steam login code
  }
}

module.exports = Account;
