module.exports = {
  account: {
    username: 'username', // Steam username
    password: 'password', // Steam password
    statusInvisible: false, // If set to "true" friends won't see notification or you playing anything
    shared_secret: '' // Auto 2FA login
  },
  // Below settings are optional if they are supplied in the global config
  idlerSettings: {
    enabled: true, // Turn idler on or off
    parallelGameIdle: 32, // Amount of games playing at the same time (max is 32)
    staticIdleTime: 0, // Number of min to idle for before switching (0 means randomized number)
    staticIdleList: [], // Games that will always be idled, example: [730, 570, 440]
    skipBannedGames: false, // If "true" it won't idle games you're banned in (except if it's in "staticIdleList")
    skipFreeGames: false, // If "true" it won't idle free to play games (except if it's in "staticIdleList")
    blacklistGames: [] // List of games not to idle, example: [730, 570, 440] (except if it's in "staticIdleList")
  }
};
