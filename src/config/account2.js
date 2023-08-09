module.exports = {
  account: {
    username: 'something',
    password: 'something',
    statusInvisible: false // If set to "true" friends will get notifications
  },
  idlerSettings: {
    parallelGameIdle: 1, // The max possible number is 32
    staticIdleTime: 0 // Is in minutes, o means random amount of time
  },
  staticIdler: {
    enabled: false, // Idle static list of games
    listToIdle: [] // 730, 570, 440
  },
  dynamicIdler: {
    enabled: false, // Idle random list of games
    skipBannedGames: false,
    skipFreeGames: false,
    blacklistGames: []
  }
};
