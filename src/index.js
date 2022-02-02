const SteamUser = require('steam-user');
const timestamp = require('time-stamp');
const config = require('./config/account');
const client = new SteamUser();
const logInOptions = {
	accountName: config.username,
	password: config.password
};

client.on('loggedOn', () => {
	logger(`Logged on with account: ${config.username}.`);
	client.setPersona(SteamUser.EPersonaState.Online);
	client.gamesPlayed(config.idleGameId);
});

client.on('vacBans', (bans, games) => logger(`Account has ${bans} VAC ban(s).`));
client.on('disconnected', (result, msg) => logger(`Account disconnected, with reason: ${msg}`));
client.on('error', (err) => logger(`Steam error: ${err}`, 'error'));

process.on('unhandledRejection', (err) => logger(`Unhandled error: ${err.message}`, 'error'));
process.on('uncaughtException', (err) => logger(`Uncatched error: ${err.message}`, 'error'));

client.logOn(logInOptions);

const logger = async (message, type) => {
	const fullMessage = `${timestamp(`YYYY/MM/DD`)} | [IDLEBOT] ${message}`;

	switch (type) {
		case 'warn':
			console.warn(fullMessage);
			break;
		case 'error':
			console.error(fullMessage);
			break;
		default:
			console.info(fullMessage);
			break;
	}
};
