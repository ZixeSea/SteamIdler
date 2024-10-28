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
  error: parseInt('e74c3c', 16)
};

module.exports = (stats) => {
  // If none specified, return
  if (!discordWebhook) return;

  // Create our embeds
  output = {
    username: 'Steam Idler',
    embeds: []
  };
  stats.forEach((a) => {
    output.embeds.push({
      // TODO: generate color based on status
      color: a.idleStatus !== 'Idling!' ? discordColors.error : discordColors.online,
      author: {
        name: a.displayName ?? a.name,
        url: `https://steamcommunity.com/profiles/${a.steamID}`,
        icon_url: a.avatar
      },
      fields: [
        { name: 'Status', value: a.idleStatus, inline: true },
        { name: 'Games list', value: a.gamesCount, inline: true },
        { name: 'Games idled', value: a.gamesIdled, inline: true },
        {
          name: a.idleStatus !== 'Idling!' ? 'Idle stopped' : 'Idle started',
          value:
            a.idleStartTime === NaN
              ? 'Unknown'
              : a.idleStatus !== 'Idling!'
              ? `<t:${Math.floor(a.stoppedIdleTime / 1000)}:R>`
              : `<t:${Math.floor(a.idleStartTime / 1000)}:R>`,
          inline: true
        },
        { name: 'Idle mode', value: a.idleMode, inline: true },
        { name: 'Idle rounds', value: a.idleRounds, inline: true }
      ],
      footer: {
        text: 'Last updated'
      },
      timestamp: new Date().toISOString()
    });
  });

  // Send our request
  const uri = discordWebhook + (discordMessageID ? `/messages/${discordMessageID}` : '') + '?wait=true';
  fetch(uri, {
    method: discordMessageID ? 'PATCH' : 'POST',
    body: JSON.stringify(output),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      discordMessageID = json.id ?? discordMessageID;
    })
    .catch((error) => {
      console.log(error);
    });
};
