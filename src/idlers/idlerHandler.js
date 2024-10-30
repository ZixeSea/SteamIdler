const gamePicker = require('./gamePicker');
const { getIdleDuration, changeMinToMs } = require('../utils/additional');
let gameSwitcher;

const loadIdler = async (account, client, config) => {
  if (account.games.length < 1) {
    const gameListToIdle = await client.getUserOwnedApps(client.steamID, {
      includePlayedFreeGames: !config.idlerSettings.skipFreeGames
    });
    account.loadGames(gameListToIdle.apps, config.idlerSettings.skipBannedGames, config.idlerSettings.blacklistGames);
  }

  startIdler(account, client, config);
};

const startIdler = (account, client, config) => {
  if (config.idlerSettings.alwaysIdleList.length === config.idlerSettings.parallelGameIdle) {
    account.update({ time: Date.now(), status: 'Idling!', idleMode: 'Static' });
    account.addRound(config.idlerSettings.alwaysIdleList.length);
    return client.gamesPlayed(config.idlerSettings.alwaysIdleList);
  }

  if (account.games.length <= config.idlerSettings.parallelGameIdle) {
    let listToIdle = [];
    account.games.forEach((g) => {
      listToIdle.push(g.id);
    });

    account.update({ time: Date.now(), status: 'Idling!', idleMode: 'Static' });
    account.addRound(listToIdle.length);
    return client.gamesPlayed(listToIdle);
  }

  startDynamicIdler(account, client, config);
};

const startDynamicIdler = (account, client, config) => {
  const idleLength =
    config.idlerSettings.idleTime !== 0 ? changeMinToMs(config.idlerSettings.idleTime) : getIdleDuration();
  const listToIdle = gamePicker(
    account.games,
    config.idlerSettings.alwaysIdleList,
    config.idlerSettings.parallelGameIdle,
    idleLength
  );

  if (account.idleStatus !== 'Idling!') account.update({ time: Date.now(), status: 'Idling!' });
  account.addRound(listToIdle.length);
  client.gamesPlayed(listToIdle);

  gameSwitcher = setTimeout(() => {
    startDynamicIdler(account, client, config);
  }, idleLength);
};

const stopIdler = (account) => {
  account.setStoppedTime();
  account.update({ status: 'Idle stopped', idleMode: 'None' });
  clearTimeout(gameSwitcher);
};

module.exports = {
  load: (account, client, config) => loadIdler(account, client, config),
  start: (account, client, config) => startIdler(account, client, config),
  stop: (account) => stopIdler(account)
};
