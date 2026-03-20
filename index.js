const { setupBot } = require('./src/bot/setupBot');
const { loadEnv } = require('./src/config/env');
const logger = require('./src/utils/logger');

function registerShutdownHandlers(bot) {
  process.once('SIGINT', () => {
    logger.info('Stopping bot (SIGINT)...');
    bot.stop('SIGINT');
  });

  process.once('SIGTERM', () => {
    logger.info('Stopping bot (SIGTERM)...');
    bot.stop('SIGTERM');
  });
}

async function startApp() {
  try {
    const env = loadEnv();
    const bot = setupBot(env);

    registerShutdownHandlers(bot);
    await bot.launch();

    logger.info('Telegram bot is running.');
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`);
    process.exit(1);
  }
}

startApp();
