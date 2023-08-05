const cluster = require('node:cluster');

if (cluster.isPrimary) {
  const startWorkers = async () => {
    const manager = await require('./sharding/manager');
    const test = manager.get(1);
    test.worker.send(`This is a message from master to worker ${test.id}`);
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
