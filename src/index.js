const cluster = require('node:cluster');
const terminalOutput = require('./outputs/terminal');
const discordOutput = require('./outputs/discord');
const stats = new Map();

process.on('unhandledRejection', (err) => console.error(`Unhandled error: ${err.message}`, err.stack));
process.on('uncaughtException', (err) => console.error(`Uncatched error: ${err.message}`, err.stack));

if (cluster.isPrimary) {
  const startWorkers = async () => {
    const manager = await require('./sharding/manager');
    for (const Worker of manager.values()) {
      Worker.worker.send({ name: 'login', config: Worker.config });
      await new Promise((resolve, reject) => {
        cluster.on('message', function (worker, message) {
          if (worker.id === Worker.id && message.name === 'login') resolve();
          if (message.name === 'stats') stats.set(worker, message.account);
        });
      });
    }

    // start outputs
    setInterval(() => {
      terminalOutput(stats);
      discordOutput(stats);
    }, 15000);
  };

  const evn = require('../package.json');
  const logo = require('asciiart-logo');
  console.info(
    logo({
      name: 'SteamIdler',
      font: 'Big',
      padding: 5,
      margin: 3
    })
      .center('Light weight multi account steam idler')
      .emptyLine()
      .center(`Version: ${evn.version}`)
      .center(`Created by: ${evn.contributors[0].name}`)
      .render()
  );

  startWorkers();
} else {
  require('./sharding/worker')();
}
