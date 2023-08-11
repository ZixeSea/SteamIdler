const { changeMsToMin } = require('../utils/additional');

class Game {
  constructor(data) {
    this.id = data.appid;
    this.name = data.name;
    this.timePlayed = data.playtime_forever;

    this.idleCount = 0;
    this.idledFor = 0;
  }

  update(time) {
    const timeInMin = changeMsToMin(time);
    this.idleCount++;
    this.idledFor += timeInMin;
    this.timePlayed += timeInMin;
  }
}

module.exports = Game;
