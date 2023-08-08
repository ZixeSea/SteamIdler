const cluster = require('node:cluster');

process.on('unhandledRejection', (err) => console.error(`Unhandled error: ${err.message}`, 'error'));
process.on('uncaughtException', (err) => console.error(`Uncatched error: ${err.message}`, 'error'));

if (cluster.isPrimary) {
  const startWorkers = async () => {
    const manager = await require('./sharding/manager');
    for (const Worker of manager.values()) {
      if (Worker.id === 1) Worker.worker.send({ name: 'login', config: Worker.config });
      await new Promise((resolve, reject) => {
        cluster.once('message', function (worker, message) {
          if (worker.id === Worker.id && message.name === 'login') resolve();
        });
      });
    }
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
