const logger = require('../utils/logger');
const SteamUser = require('steam-user');
const Account = require('../structures/Account');
const client = new SteamUser();

let config = null;
let account = null;

module.exports = () => {
  process.on('message', function (message) {
    switch (message.name) {
      case 'login':
        config = message.config;
        account = new Account({ name: config.account.username, status: 'Preparing' });
        client.logOn({
          accountName: message.config.account.username,
          password: message.config.account.password
        });
        break;
    }
  });

  client.on('loggedOn', async () => {
    logger.info(`Logged on to ${account.name}, preparing to idle`);
    await setTimeout(() => {
      return process.send({ name: 'login' });
    }, 5000);

    client.setPersona(
      config.account.statusInvisible ? SteamUser.EPersonaState.Invisible : SteamUser.EPersonaState.Online
    );

    if (!config.staticIdler.enabled && !config.dynamicIdler.enabled) {
      account.update({ time: NaN, status: 'Not idling' });
      return logger.warn(`Both idle options are turned off for ${account.name}, it will be online without idling`);
    }

    if (config.idlerSettings.parallelGameIdle < 1) {
      logger.warn(`Changed parallelGameIdle to 1 for ${account.name}, original input was incorrect.`);
      config.idlerSettings.parallelGameIdle = 1;
    }

    if (config.idlerSettings.parallelGameIdle > 32) {
      logger.warn(`Changed parallelGameIdle to 32 for ${account.name}, original input was incorrect.`);
      config.idlerSettings.parallelGameIdle = 32;
    }

    if (config.idlerSettings.staticIdleTime < 5 && config.idlerSettings.staticIdleTime !== 0) {
      logger.warn(`Changed staticIdleTime to 5 for ${account.name}, original input was to low.`);
      config.idlerSettings.staticIdleTime = 5;
    }

    if (config.dynamicIdler.enabled) {
      if (config.staticIdler.enabled) {
        logger.warn(`dynamicIdler and staticIdler is on for ${account.name}, picked dynamicIdler.`);
      }

      require('../idlers/dynamicIdler')(account, client, config);
      return logger.info(`The idler dynamicIdler will now be started for ${account.name}.`);
    }

    if (config.staticIdler.enabled) {
      if (config.staticIdler.listToIdle.length < 1) {
        account.update({ time: NaN, status: 'Not idling' });
        logger.warn(`listToIdle but no games provided for ${account.name}, it won't idle.`);
      }

      require('../idlers/staticIdler')(account, client, config);
      return logger.info(`The idler staticIdler will now be started for ${account.name}.`);
    }
  });

  client.on('vacBans', (bans, gameIds) => {
    if (config.dynamicIdler.enabled && config.dynamicIdler.skipBannedGames) account.setBanned(gameIds);
    logger.info(bans === 0 ? `${account.name} doesn't have any bans.` : `${account.name} has ${bans} game/vac ban(s).`);
  });

  client.on('disconnected', (result, msg) => logger.error(`${account.name} has disconnected, with reason: ${msg}`));
  client.on('error', (err) => logger.error(`Steam error for ${account.name}: ${err}`));
};
