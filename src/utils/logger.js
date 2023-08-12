const { Console } = require('console');
const colors = require('colors');
const timestamp = require('time-stamp');

const console = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  colorMode: false
});

colors.setTheme({
  silly: 'rainbow',
  log: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'cyan',
  error: 'red'
});

class Logger {
  constructor() {}

  log(msg) {
    let message = colors.log(msg);
    console.log(`${addTime()} | ${message}`);
  }

  info(msg) {
    let message = colors.info(msg);
    console.info(`${addTime()} | ${message}`);
  }

  warn(msg) {
    let message = colors.warn(msg);
    console.warn(`${addTime()} | ${message}`);
  }

  error(msg) {
    let message = colors.error(msg);
    console.error(`${addTime()} | ${message}`);
  }

  data(msg) {
    let message = colors.data(msg);
    console.log(`${addTime()} | ${message}`);
  }

  debug(msg) {
    let message = colors.debug(msg);
    console.debug(`${addTime()} | ${message}`);
  }
}

module.exports = new Logger();

const addTime = () => {
  return `${timestamp(`YYYY/MM/DD HH:mm:ss`)}`;
};
