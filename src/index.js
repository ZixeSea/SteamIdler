const SteamUser = require('steam-user');
const logger = require('./utils/logger');
const idler = require('./utils/idler');
const { createGameList } = require('./utils/additional');
const evn = require('../package.json');
const logo = require('asciiart-logo');
const client = new SteamUser();
let bannedGameList = [];
let gameList = [];

const accOptions = require('./config/account').accOptions;
const idleOptions = require('./config/account').idleOptions;
const logInOptions = {
	accountName: accOptions.username,
	password: accOptions.password
};

console.info(
	logo({
		name: 'SteamIdler',
		font: 'Big',
		padding: 5,
		margin: 3
	})
		.emptyLine()
		.center(`Version: ${evn.version}`)
		.center(`Created by: ${evn.contributors[0].name}`)
		.render()
);

client.on('loggedOn', async () => {
	logger(`Logged on with account: ${accOptions.username}.`);
	client.setPersona(accOptions.statusInvisible ? SteamUser.EPersonaState.Invisible : SteamUser.EPersonaState.Online);
	if (!idleOptions.randomIdleGames) {
		if (idleOptions.idleToIdle <= 0 || idleOptions.idleToIdle > 32)
			return logger(`Idle list is to ${idleOptions.idleToIdle > 32 ? 'long' : 'short'}, use between 1 and 32 games.`);

		logger(`Now idling ${idleOptions.idleToIdle.length} game(s) [${idleOptions.idleToIdle.join(', ')}].`);
		return client.gamesPlayed(idleOptions.idleToIdle);
	}

	if (gameList.length <= 0) startIdler(client);
});

const startIdler = async (client) => {
	const ownedGameList = await client.getUserOwnedApps(client.steamID, {
		includePlayedFreeGames: idleOptions.idleFreeGames
	});
	logger(`This account owns ${ownedGameList.app_count} game(s).`);

	createGameList(ownedGameList.apps, gameList, bannedGameList);
	if (gameList.length <= 0) return logger(`There are no games to idle.`);

	let idleGames = await idler(client, gameList);
	if (!idleGames.isAllGames) {
		setInterval(async () => {
			if (idleGames.endIdle < Date.now()) {
				logger(`Done idling "${idleGames.games.join(', ')}", idled for ${idleGames.idleTime / 60000} min.`);
				idleGames = await idler(client, gameList);
			}
		}, 2500);
	}
};

client.on('vacBans', (bans, games) => {
	if (idleOptions.SkipBannedGames) bannedGameList = games;
	logger(bans === 0 ? "Accouunt doesn't have any bans." : `Account has ${bans} ban(s) [${games.join(', ')}].`);
});

client.on('disconnected', (result, msg) => logger(`Account disconnected, with reason: ${msg}`));
client.on('error', (err) => logger(`Steam error: ${err}`, 'error'));

process.on('unhandledRejection', (err) => logger(`Unhandled error: ${err.message}`, 'error'));
process.on('uncaughtException', (err) => logger(`Uncatched error: ${err.message}`, 'error'));

client.logOn(logInOptions);
