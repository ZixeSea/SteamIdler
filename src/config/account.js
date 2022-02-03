//730,570,440 (CSGO,DOTA2,TF2)
module.exports = {
	accOptions: {
		username: 'kikkerxd8',
		password: 'Lindeboom1'
	},
	idleOptions: {
		randomIdleGames: true, // if true it will get all your games and pick random
		idleFreeGames: true,
		staticIdleTime: 0, // if 0 it will created a random number (in MS)
		blacklist: [ 700580 ], // backlist games from getting randomly idled
		idleToIdle: [ 730, 570, 440 ] // only runs when randomIdleGames is false
	}
};
