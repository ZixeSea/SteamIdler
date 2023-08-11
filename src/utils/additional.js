module.exports = {
  getIdleDuration: () => {
    let random = Math.floor(Math.random() * 6) + 5;
    return (random *= 240000) + 600000;
  },
  changeMinToMs: (min) => {
    return min * 60 * 1000;
  },
  changeMsToMin: (ms) => {
    return ms / 1000 / 60;
  },
  startTimeToHours: (startTime) => {
    const timePassed = Date.now() - startTime;
    const sec = Math.floor(timePassed / 1000);
    const min = Math.floor(sec / 60);
    return (min / 60).toFixed(2);
  },
  selectRandomGame: (gameList) => {
    let random = Math.floor(Math.random() * gameList.length);
    return gameList[random];
  },
  timeout: (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
  }
};
