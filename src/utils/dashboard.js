const { Table } = require('console-table-printer');
const { startTimeToHours } = require('../utils/additional');

module.exports = (stats) => {
  const t1 = new Table({
    title: 'Steam account',
    columns: [
      { name: 'name', title: 'Username', alignment: 'left' },
      { name: 'list', title: 'To Idle', alignment: 'right' },
      { name: 'time', title: 'Time Idled', alignment: 'right' },
      { name: 'games', title: 'Games Idled', alignment: 'right' },
      { name: 'rounds', title: 'Idle rounds', alignment: 'right' },
      { name: 'status', title: 'Status', alignment: 'left' }
    ]
  });

  stats.forEach((a) => {
    t1.addRow({
      name: a.name,
      list: a.gamesCount,
      time: a.idleStartTime === NaN ? 'None' : `${startTimeToHours(a.idleStartTime)} h`,
      games: a.gamesIdled,
      rounds: a.idleRounds,
      status: a.idleStatus
    });
  });

  console.clear();
  t1.printTable();
};
