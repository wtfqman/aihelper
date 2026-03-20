const { Telegraf } = require('telegraf');
const { registerStartHandler } = require('../handlers/startHandler');
const { registerTextHandler } = require('../handlers/textHandler');
const logger = require('../utils/logger');

function setupBot(env) {
  const bot = new Telegraf(env.botToken);

  registerStartHandler(bot);
  registerTextHandler(bot);

  bot.catch((error, ctx) => {
    const updateType = ctx && ctx.updateType ? ctx.updateType : 'unknown';
    logger.error(`Unhandled bot error on update "${updateType}": ${error.message}`);
  });

  return bot;
}

module.exports = {
  setupBot
};
