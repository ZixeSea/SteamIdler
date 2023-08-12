const { Table } = require('console-table-printer');
const { startTimeToHours } = require('../utils/additional');

module.exports = (stats) => {
  const t1 = new Table({
    title: 'List Of Steam Accounts',
    columns: [
      { name: 'name', title: 'Username', alignment: 'left' },
      { name: 'list', title: 'Games list', alignment: 'right' },
      { name: 'time', title: 'Time idled', alignment: 'right' },
      { name: 'games', title: 'Games idled', alignment: 'right' },
      { name: 'rounds', title: 'Idle rounds', alignment: 'right' },
      { name: 'status', title: 'Status', alignment: 'left' }
    ]
  });

  stats.forEach((a) => {
    t1.addRow({
      name: a.name,
      list: a.gamesCount,
      time:
        a.idleStartTime === NaN
          ? 'Unknown'
          : a.idleStatus !== 'Idling!'
          ? `${startTimeToHours(a.stoppedIdleTime)} H`
          : `${startTimeToHours(Date.now() - a.idleStartTime)} H`,
      games: a.gamesIdled,
      rounds: a.idleRounds,
      status: a.idleStatus
    });
  });

  console.clear();
  t1.printTable();
};
