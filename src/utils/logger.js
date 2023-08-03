const timestamp = require('time-stamp');

module.exports = (message, type) => {
  const fullMessage = `${timestamp(`YYYY/MM/DD`)} | [IDLEBOT] ${message}`;

  switch (type) {
    case 'warn':
      console.warn(fullMessage);
      break;
    case 'error':
      console.error(fullMessage);
      break;
    default:
      console.info(fullMessage);
      break;
  }
};
