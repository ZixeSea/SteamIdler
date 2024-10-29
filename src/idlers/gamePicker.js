const { selectRandomGame } = require('../utils/additional');

module.exports = (gameList, staticList, toIdle, idleLength) => {
  let gameToIdle = Array.isArray(staticList) ? staticList : [];
  while (gameToIdle.length < toIdle) {
    const selectedGame = selectRandomGame(gameList);
    if (!gameToIdle.includes(selectedGame.id)) {
      gameToIdle.push(selectedGame.id);
      selectedGame.update(idleLength);
    }
  }

  return gameToIdle;
};
