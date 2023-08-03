class Game {
  constructor(name, id, playtime) {
    this.name = name;
    this.id = id;
    this.playtime = playtime;

    this.idledFor = 0;
  }

  async update(time) {
    this.idledFor += time;
    this.playtime += time / 60000;
  }
}

module.exports = Game;
