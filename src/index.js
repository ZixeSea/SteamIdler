const SteamUser = require('steam-user');
const config = require('./config/account');
const logger = require('./utils/logger');
const client = new SteamUser();
const logInOptions = {
	accountName: config.accOptions.username,
	password: config.accOptions.password
};

client.on('loggedOn', () => {
	logger(`Logged on with account: ${config.accOptions.username}.`);
	client.setPersona(SteamUser.EPersonaState.Online);
	if (!config.idleOptions.randomIdleGames) {
		client.gamesPlayed(config.idleOptions.idleGameId);
		logger(`Now idling the games: ${config.idleOptions.idleGameId.join(', ')}.`);
	}
});

client.on('vacBans', (bans, games) => logger(`Account has ${bans} VAC ban(s).`));
client.on('disconnected', (result, msg) => logger(`Account disconnected, with reason: ${msg}`));
client.on('error', (err) => logger(`Steam error: ${err}`, 'error'));

process.on('unhandledRejection', (err) => logger(`Unhandled error: ${err.message}`, 'error'));
process.on('uncaughtException', (err) => logger(`Uncatched error: ${err.message}`, 'error'));

client.logOn(logInOptions);
