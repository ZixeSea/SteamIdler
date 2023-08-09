class Game {
  constructor(data) {
    this.id = data.appid;
    this.name = data.name;
    this.timePlayed = data.playtime_forever;

    this.idleCount = 0;
    this.idleTime = 0;
  }

  update(time) {
    this.idleCount++;
    this.idledFor += time;
    this.timePlayed += time / 60000;
  }
}

module.exports = Game;
