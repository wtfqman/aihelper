const { sendSafeMessage } = require('../services/telegramService');
const logger = require('../utils/logger');

function buildStartMessage(ctx) {
  const firstName = ctx.from && ctx.from.first_name ? `, ${ctx.from.first_name}` : '';

  return `Привет${firstName}! Бот запущен и готов к работе.`;
}

async function handleStart(ctx) {
  try {
    const wasSent = await sendSafeMessage(ctx, buildStartMessage(ctx));

    if (wasSent) {
      logger.info(`Handled /start for user ${ctx.from ? ctx.from.id : 'unknown'}.`);
    }
  } catch (error) {
    logger.error(`Error in /start handler: ${error.message}`);
  }
}

function registerStartHandler(bot) {
  bot.start(handleStart);
}

module.exports = {
  handleStart,
  registerStartHandler
};
