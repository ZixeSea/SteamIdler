/*
GLOBAL CONFIGURATION
*/
module.exports = {
  /*
  These settings are global and will affect any accounts that do not have the setting specified in their specific account config file
  Include any of these in the account specific config file to override these settings
  */
  idlerSettings: {
    enabled: true, // Turn idler on or off
    parallelGameIdle: 32, // Amount of games playing at the same time (max is 32)
    staticIdleTime: 0, // Number of min to idle for before switching (0 means randomized number)
    staticIdleList: [], // Games that will always be idled, example: [730, 570, 440]
    skipBannedGames: false, // If "true" it won't idle games you're banned in (except if it's in "staticIdleList")
    skipFreeGames: false, // If "true" it won't idle free to play games (except if it's in "staticIdleList")
    blacklistGames: [] // List of games not to idle, example: [730, 570, 440] (except if it's in "staticIdleList")
  },
  /*
  These settings are not account specific, but for the program itself
  */
  discordWebhook: '' // Discord webhook to send stats to
};
