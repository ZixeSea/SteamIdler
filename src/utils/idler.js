const { getIdleDuration, selectRandomGame } = require('./additional');
const staticIdleTime = require('../config/account').idleOptions.staticIdleTime;
const logger = require('./logger');

module.exports = (client, gameList) => {
	const gameToIdle = selectRandomGame(gameList);
	let idleTime = staticIdleTime !== 0 ? staticIdleTime : getIdleDuration();
	if (idleTime < 60000) idleTime = 60000;

	gameToIdle.update(idleTime);
	client.gamesPlayed(gameToIdle.id);
	logger(`Started idling "${gameToIdle.name}" for ${idleTime / 60000} min.`);

	return gameToIdle;
};
