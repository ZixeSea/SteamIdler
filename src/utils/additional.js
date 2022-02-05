const blacklistGames = require('../config/account').idleOptions.blacklist;
const Game = require('./Game');

module.exports = {
	getIdleDuration: () => {
		let random = Math.floor(Math.random() * 20) + 5;
		return (random *= 120000);
	},
	selectRandomGame: (gameList) => {
		let random = Math.floor(Math.random() * gameList.length);
		return gameList[random];
	},
	createGameList: (games, gameList) => {
		games.forEach((g) => {
			if (!blacklistGames.includes(g.appid)) {
				gameList.push(new Game(g.name, g.appid, g.playtime_forever));
			}
		});
	},
	timeout: (time) => {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
};
