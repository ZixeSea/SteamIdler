module.exports = {
	getIdleDuration: () => {
		let random = Math.floor(Math.random() * 20 + 5);
		return (random *= 120000);
	},
	timeout: (time) => {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
};
