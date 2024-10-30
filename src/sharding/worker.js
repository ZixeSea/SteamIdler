const logger = require('../utils/logger');
const SteamUser = require('steam-user');
const SteamTotp = require('steam-totp');
const Account = require('../structures/Account');
const client = new SteamUser({ renewRefreshTokens: true });

const { join, resolve } = require('node:path');
const basePath = resolve(join(__dirname, '../'));
const configPath = join(basePath, '/config');
const { readFileSync, writeFileSync } = require('fs');

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

        let logOnOptions = {};
        try {
          const refreshToken = readFileSync(`${configPath}/${message.config.account.username}.txt`)
            .toString('utf8')
            .trim();
          logOnOptions = {
            refreshToken,
            machineName: 'SteamIdler'
          };
        } catch (errpr) {
          // The error doesn't matter, normal login callback
          logOnOptions = {
            accountName: message.config.account.username,
            password: message.config.account.password,
            machineName: 'SteamIdler',
            twoFactorCode: message.config.account.shared_secret
              ? SteamTotp.generateAuthCode(message.config.account.shared_secret)
              : undefined
          };
        }

        client.logOn(logOnOptions);
        break;
    }
  });

  client.on('loggedOn', async () => {
    logger.info(`Logged on to ${account.name}, preparing to idle`);
    account.steamID = client.steamID.getSteamID64();
    const persona = (await client.getPersonas([account.steamID]))?.personas?.[account.steamID];
    account.displayName = persona?.player_name || account.name;
    account.avatar =
      persona?.avatar_url_medium ||
      'https://avatars.cloudflare.steamstatic.com/fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg';
    await setTimeout(() => {
      return process.send({ name: 'login' });
    }, 5000);
    client.setPersona(
      config.account.statusInvisible ? SteamUser.EPersonaState.Invisible : SteamUser.EPersonaState.Online
    );

    if (!config.idlerSettings.enabled) {
      account.update({ status: 'Not idling', idleMode: 'None' });
      process.send({ name: 'stats', account });
      return logger.warn(`Idler is turned off for ${account.name}, it will be online without idling`);
    }

    if (config.idlerSettings.parallelGameIdle < 1) {
      logger.warn(`Changed parallelGameIdle to 1 for ${account.name}, original input was incorrect`);
      config.idlerSettings.parallelGameIdle = 1;
    }

    if (config.idlerSettings.parallelGameIdle > 32) {
      logger.warn(`Changed parallelGameIdle to 32 for ${account.name}, original input was incorrect`);
      config.idlerSettings.parallelGameIdle = 32;
    }

    if (config.idlerSettings.idleTime < 5 && config.idlerSettings.idleTime !== 0) {
      logger.warn(`Changed idleTime to 5 for ${account.name}, original input was to low`);
      config.idlerSettings.idleTime = 5;
    }

    if (config.idlerSettings.alwaysIdleList.length > 32) {
      logger.warn(`Removed overflowing games for ${account.name}, don't is alwaysIdleList for more than 32 games`);
      config.idlerSettings.alwaysIdleList = config.idlerSettings.alwaysIdleList.slice(0, 32);
    }

    if (config.idlerSettings.alwaysIdleList.length > config.idlerSettings.parallelGameIdle) {
      logger.warn(
        `Changed parallelGameIdle to ${config.idlerSettings.alwaysIdleList.length} for ${account.name}, more games were listed in alwaysIdleList`
      );
      config.idlerSettings.parallelGameIdle = config.idlerSettings.alwaysIdleList.length;
    }

    account.update({ idleMode: 'Dynamic' }); // Defaults to dynamic
    idler = require('../idlers/idlerHandler');
    idler.load(account, client, config);

    process.send({ name: 'stats', account });
    statsPusher = setInterval(() => {
      return process.send({ name: 'stats', account });
    }, 20000);

    return logger.info(`The idler will now be started for ${account.name}`);
  });

  client.on('vacBans', (bans, gameIds) => {
    account.setBanned(gameIds);
    logger.info(
      bans === 0
        ? `${account.name} doesn't have any game/vac bans`
        : `${account.name} has ${bans} game/vac ban(s) [${gameIds.join(', ')}]`
    );
  });

  client.on('refreshToken', (token) => {
    writeFileSync(`${configPath}/${config.account.username}.txt`, token);
    logger.info(`Got new refresh token for ${account.name}`);
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
