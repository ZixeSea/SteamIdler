/*
GLOBAL CONFIGURATION

These settings are global and will affect any accounts that do not have the setting specified
*/
module.exports = {
  idlerSettings: {
    parallelGameIdle: 32, // Amount of games playing at the same time (max is 32)
    staticIdleTime: 0 // Number of min to idle for before switching (0 is random number)
  },
  staticIdler: {
    enabled: false, // Idle static list of games (listed in "listToIdle")
    listToIdle: [] // List to idle (example: [730, 570, 440])
  },
  dynamicIdler: {
    enabled: false, // Idle random list of games (randomly selected from the game you own)
    skipBannedGames: false, // If "true" it won't idle games you're banned in
    skipFreeGames: false, // If "true" it won't idle free to play games
    blacklistGames: [] // List of games not to idle (example: [730, 570, 440])
  }
};
