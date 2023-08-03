const { getIdleDuration, selectRandomGame } = require('./additional');
const idleOptions = require('../config/account').idleOptions;
const logger = require('./logger');

module.exports = async (client, gameList) => {
  let count = 0;
  let idleTime =
    idleOptions.staticIdleTime !== 0
      ? idleOptions.staticIdleTime < 60000
        ? 60000
        : idleOptions.staticIdleTime
      : getIdleDuration();
  let parallelCount =
    idleOptions.parallelGameIdle <= 1 ? 1 : idleOptions.parallelGameIdle > 32 ? 32 : idleOptions.parallelGameIdle;
  const endIdle = Date.now() + idleTime;

  if (gameList.length < parallelCount) parallelCount = gameList.length;

  let gameToIdle = { games: [], idleTime, endIdle, isAllGames: parallelCount === gameList.length ? true : false };
  while (count < parallelCount) {
    const selectedGame = selectRandomGame(gameList);
    selectedGame.update(idleTime);
    if (!gameToIdle.games.includes(selectedGame.id)) {
      gameToIdle.games.push(selectedGame.id);
      count++;
    }
  }

  client.gamesPlayed(gameToIdle.games);
  logger(
    gameToIdle.isAllGames
      ? 'Started idling all your games.'
      : `Started idling "${gameToIdle.games.join(', ')}" for ${idleTime / 60000} min.`
  );

  return await gameToIdle;
};
