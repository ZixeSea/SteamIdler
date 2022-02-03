class Game {
	constructor(name, id, playtime) {
		this.name = name;
		this.id = id;
		this.playtime = playtime;

		this.idledFor = 0;
		this.endIdle = 0;
	}

	async update(time) {
		this.idledFor += time;
		this.endIdle = Date.now() + time;
		this.playtime += time / 60000;
	}
}

module.exports = Game;
