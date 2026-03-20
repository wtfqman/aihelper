function formatMessage(level, message) {
  return `[${level}] ${message}`;
}

function info(message) {
  console.log(formatMessage('INFO', message));
}

function error(message) {
  console.error(formatMessage('ERROR', message));
}

module.exports = {
  info,
  error
};
