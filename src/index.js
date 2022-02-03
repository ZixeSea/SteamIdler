const SteamUser = require('steam-user');
const logger = require('./utils/logger');
const idler = require('./utils/idler');
const { createGameList } = require('./utils/additional');
const client = new SteamUser();
let gameList = [];

const accOptions = require('./config/account').accOptions;
const idleOptions = require('./config/account').idleOptions;
const logInOptions = {
	accountName: accOptions.username,
	password: accOptions.password
};

client.on('loggedOn', async () => {
	logger(`Logged on with account: ${accOptions.username}.`);
	client.setPersona(SteamUser.EPersonaState.Online);
	if (!idleOptions.randomIdleGames) {
		logger(`Now idling ${idleOptions.idleToIdle.length} game(s) [${idleOptions.idleToIdle.join(', ')}].`);
		return client.gamesPlayed(idleOptions.idleToIdle);
	}

	const OwnedGameList = await client.getUserOwnedApps(client.steamID, {
		includePlayedFreeGames: idleOptions.idleFreeGames
	});
	logger(`There are ${OwnedGameList.app_count} game(s) in the list.`);

	createGameList(OwnedGameList.apps, gameList);
	let idleGame = idler(client, gameList);

	setInterval(() => {
		if (idleGame.endIdle < Date.now()) {
			logger(`Done idling "${idleGame.name}", total idle-time ${idleGame.idledFor / 60000} min.`);
			idleGame = idler(client, gameList);
		}
	}, 2500);
});

client.on('vacBans', (bans, games) => logger(`Account has ${bans} ban(s) [${games.join(', ')}].`));
client.on('disconnected', (result, msg) => logger(`Account disconnected, with reason: ${msg}`));
client.on('error', (err) => logger(`Steam error: ${err}`, 'error'));

process.on('unhandledRejection', (err) => logger(`Unhandled error: ${err.message}`, 'error'));
process.on('uncaughtException', (err) => logger(`Uncatched error: ${err.message}`, 'error'));

client.logOn(logInOptions);
