const cluster = require('node:cluster');
const bashboard = require('./utils/dashboard');
const stats = new Map();

process.on('unhandledRejection', (err) => console.error(`Unhandled error: ${err.message}`, err.stack));
process.on('uncaughtException', (err) => console.error(`Uncatched error: ${err.message}`, err.stack));

if (cluster.isPrimary) {
  const startWorkers = async () => {
    const manager = await require('./sharding/manager');
    for (const Worker of manager.values()) {
      Worker.worker.send({ name: 'login', config: Worker.config });
      await new Promise((resolve, reject) => {
        cluster.once('message', function (worker, message) {
          if (worker.id === Worker.id && message.name === 'login') resolve();
        });
      });
    }

    setInterval(() => {
      bashboard(stats);
    }, 30000);
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
  cluster.on('message', (worker, message) => {
    if (message.name === 'stats') {
      stats.set(worker, message.account);
    }
  });
} else {
  require('./sharding/worker')();
}
