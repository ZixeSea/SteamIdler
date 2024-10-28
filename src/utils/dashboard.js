const { Table } = require('console-table-printer');
const { startTimeToHours } = require('../utils/additional');

// Discord settings
let discordWebhook;
let discordMessageID = null;
try {
  discordWebhook = require('../config/global').discordWebhook;
} catch (e) {
  discordWebhook = null;
}
const discordColors = {
  online: parseInt('2ecc71', 16),
  offline: parseInt('95a5a6', 16),
  error: parseInt('e74c3c', 16),
};

const logToDiscord = (stats) => {
  // If none specified, return
  if (!discordWebhook) return;

  // Create our embeds
  output = {
    username: 'Steam Idler',
    embeds: [],
  }
  stats.forEach((a) => {
    output.embeds.push({
      // TODO: generate color based on status
      color: discordColors.online,
      author: {
        // TODO: get account username and avatar and steam ID/uri
        name: a.name,
        // url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFwJn6xwsA3Vql8bTgSXciDMgAxGBB_l_VdQ&s",
        // icon_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFwJn6xwsA3Vql8bTgSXciDMgAxGBB_l_VdQ&s"
      },
      fields: [
        { name: 'Games list', value: a.gamesCount, inline: true },
        { name: 'Time idled', value: a.idleStartTime === NaN
          ? 'Unknown'
          : a.idleStatus !== 'Idling!'
          ? `${startTimeToHours(a.stoppedIdleTime)} H`
          : `${startTimeToHours(Date.now() - a.idleStartTime)} H`, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: 'Games idled', value: a.gamesIdled, inline: true },
        { name: 'Idle rounds', value: a.idleRounds, inline: true },
        { name: '\u200b', value: '\u200b', inline: true },
        { name: 'Status', value: a.idleStatus, inline: true }
      ],
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Last updated'
      },
    });
  });

  // Send our request
  const uri = discordWebhook + (discordMessageID ? `/messages/${discordMessageID}` : '') + '?wait=true';
  fetch(uri, {
    method: discordMessageID ? 'PATCH' : 'POST',
    body: JSON.stringify(output),
    headers: {
        'Content-type': 'application/json; charset=UTF-8',
    },
  }).then((response) => {
      return response.json()
    })
    .then((json) => {
      discordMessageID = json.id ?? discordMessageID;
    })
    .catch(error => {
        console.log(error)
    })

}

const logToConsole = (stats) => {
  const t1 = new Table({
    title: 'List Of Running Steam Accounts | SteamIdler By ZixeSea',
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

module.exports = (stats) => {
  logToConsole(stats);
  logToDiscord(stats);
}
