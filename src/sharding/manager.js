const logger = require('../utils/logger');
const cluster = require('node:cluster');
const { readdirSync } = require('node:fs');
const { join, resolve } = require('node:path');
const basePath = resolve(join(__dirname, '../'));
const Worker = require('../structures/Worker');
const workers = new Map();

const reservedConfigFiles = ['global.js'];

module.exports = new Promise((resolve, reject) => {
  // Skip any config filenames that are reserved
  let configList = readdirSync(join(basePath, '/config')).filter(file => !reservedConfigFiles.includes(file));

  // Load our global config if it exists
  let globalConfig = {};
  try {
    globalConfig = require(join(join(basePath, '/config'), 'global.js'));
  } catch (error) {
    logger.info('Global config not found, consider creating one to apply global settings');
  }

  for (const configFile of configList) {
    // Use our global config as a base and then override it with the account specific config
    const config = {... globalConfig, ...require(join(join(basePath, '/config'), configFile))};
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
