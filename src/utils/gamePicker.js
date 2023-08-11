const { selectRandomGame } = require('../utils/additional');

module.exports = (gameList, amount, idleLength) => {
  let gameToIdle = [];
  while (gameToIdle.length < amount) {
    const selectedGame = selectRandomGame(gameList);
    if (!gameToIdle.includes(selectedGame.id)) {
      gameToIdle.push(selectedGame.id);
      selectedGame.update(idleLength);
    }
  }

  return gameToIdle;
};
