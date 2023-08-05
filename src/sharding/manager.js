const logger = require('../utils/logger');
const cluster = require('node:cluster');
const { readdirSync } = require('node:fs');
const { join, resolve } = require('node:path');
const basePath = resolve(join(__dirname, '../'));
const Worker = require('../structures/Worker');
const workers = new Map();

module.exports = new Promise((resolve, reject) => {
  const configList = readdirSync(join(basePath, '/config'));
  for (const configFile of configList) {
    const config = require(join(join(basePath, '/config'), configFile));
    const worker = cluster.fork();

    worker.once('online', async () => {
      logger.info(`Worker ${worker.id} for ${config.account.username} has been started`);
      workers.set(worker.id, new Worker(worker.id, config, cluster));
    });

    worker.on('disconnect', () => {
      logger.error(`Worker ${worker.id} for ${config.account.username} has died, stopped idling`);
    });
  }

  const upChecker = setInterval(() => {
    if (configList.length === workers.size) {
      clearInterval(upChecker);
      resolve(workers);
    }
  }, 2500);
});
