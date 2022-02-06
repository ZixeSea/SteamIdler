//730,570,440 (CSGO,DOTA2,TF2)
module.exports = {
	accOptions: {
		username: 'kikkerxd8',
		password: 'Lindeboom1',
		statusInvisible: false
	},
	idleOptions: {
		randomIdleGames: true, // if true it will get all your games and pick random
		idleFreeGames: true, // Includes free games that you have played before
		parallelGameIdle: 0, // This will idle multiple games at ones upto 25 (if 0 or 1 is disabled)
		staticIdleTime: 0, // if 0 it will created a random number (in MS)
		blacklist: [ 700580 ], // backlist games from getting randomly idled
		idleToIdle: [ 730, 570, 440 ] // only runs when randomIdleGames is false
	}
};
