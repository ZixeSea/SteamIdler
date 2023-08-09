module.exports = async (account, client, config) => {
  if (account.games.length < 1) {
    const gameListToIdle = await client.getUserOwnedApps(client.steamID, {
      includePlayedFreeGames: config.dynamicIdler.skipFreeGames
    });
    account.loadGames(gameListToIdle.apps, config.dynamicIdler.blacklistGames);
  }

  if (account.games.length <= config.idlerSettings.parallelGameIdle) {
    let idleList = [];
    account.games.forEach((g) => {
      idleList.push(g.id);
    });

    return client.gamesPlayed(idleList);
  }

  console.info(`There are ${account.games.length} game(s) loaded for ${account.name} to idle with.`);
};
