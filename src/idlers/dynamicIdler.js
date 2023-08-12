const gamePicker = require('../utils/gamePicker');
const { getIdleDuration, changeMinToMs } = require('../utils/additional');
let gameSwitcher;

const loadIdler = async (account, client, config) => {
  if (account.games.length < 1) {
    const gameListToIdle = await client.getUserOwnedApps(client.steamID, {
      includePlayedFreeGames: !config.dynamicIdler.skipFreeGames
    });
    account.loadGames(gameListToIdle.apps, config.dynamicIdler.blacklistGames);
  }

  startIdler(account, client, config);
};

const startIdler = (account, client, config) => {
  if (account.games.length <= config.idlerSettings.parallelGameIdle) {
    let listToIdle = [];
    account.games.forEach((g) => {
      listToIdle.push(g.id);
    });

    account.update({ time: Date.now(), status: 'Idling!' });
    account.addRound(listToIdle.length);
    return client.gamesPlayed(listToIdle);
  }

  const idleLength =
    config.idlerSettings.staticIdleTime !== 0 ? changeMinToMs(config.idlerSettings.staticIdleTime) : getIdleDuration();
  const listToIdle = gamePicker(account.games, config.idlerSettings.parallelGameIdle, idleLength);
  if (account.idleStatus !== 'Idling!') account.update({ time: Date.now(), status: 'Idling!' });

  account.addRound(listToIdle.length);
  client.gamesPlayed(listToIdle);

  gameSwitcher = setTimeout(() => {
    startIdler(account, client, config);
  }, idleLength);
};

const stopIdler = (account) => {
  account.setStoppedTime();
  account.update({ status: 'Idle stopped' });
  clearTimeout(gameSwitcher);
};

module.exports = {
  load: (account, client, config) => loadIdler(account, client, config),
  start: (account, client, config) => startIdler(account, client, config),
  stop: (account) => stopIdler(account)
};
