const logger = require('../utils/logger');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const Account = require('../structures/Account');
const client = new SteamUser();

let idler;
let statsPusher;
let config = null;
let account = null;

module.exports = () => {
  process.on('message', function (message) {
    switch (message.name) {
      case 'login':
        config = message.config;
        account = new Account({ name: config.account.username, status: 'Preparing' });
        process.send({ name: 'stats', account });
        client.logOn({
          accountName: message.config.account.username,
          password: message.config.account.password,
          machineName: 'SteamIdler',
          twoFactorCode: message.config.account.shared_secret ? SteamTotp.generateAuthCode(message.config.account.shared_secret) : undefined,
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
      account.update({ status: 'Not idling' });
      process.send({ name: 'stats', account });
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

      idler = require('../idlers/dynamicIdler');
      idler.load(account, client, config);

      process.send({ name: 'stats', account });
      statsPusher = setInterval(() => {
        return process.send({ name: 'stats', account });
      }, 20000);

      return logger.info(`The idler dynamicIdler will now be started for ${account.name}.`);
    }

    if (config.staticIdler.enabled) {
      if (config.staticIdler.listToIdle.length < 1) {
        account.update({ status: 'Not idling' });
        process.send({ name: 'stats', account });
        return logger.warn(`listToIdle but no games provided for ${account.name}, it won't idle.`);
      }

      idler = require('../idlers/staticIdler');
      idler.load(account, client, config);

      process.send({ name: 'stats', account });
      statsPusher = setInterval(() => {
        return process.send({ name: 'stats', account });
      }, 5000);

      return logger.info(`The idler staticIdler will now be started for ${account.name}.`);
    }
  });

  client.on('vacBans', (bans, gameIds) => {
    account.setBanned(gameIds);
    logger.info(
      bans === 0
        ? `${account.name} doesn't have any game/vac bans.`
        : `${account.name} has ${bans} game/vac ban(s) [${gameIds.join(', ')}].`
    );
  });

  client.on('disconnected', (result, msg) => {
    if (idler) idler.stop(account);
    setTimeout(() => {
      clearInterval(statsPusher);
    }, 11000);
    account.update({ status: 'Disconnected' });
    logger.error(`${account.name} has disconnected, with reason: ${msg}`);
  });

  client.on('error', (err) => {
    if (idler) idler.stop(account);
    setTimeout(() => {
      clearInterval(statsPusher);
    }, 11000);
    if (err.message.includes('LoggedInElsewhere')) {
      account.update({ status: 'Session taken' });
      return logger.error(`Session from ${account.name} got taken from another location`);
    }

    account.update({ status: 'Steam error' });
    logger.error(`Steam error for ${account.name}: ${err.message}`);
  });
};
