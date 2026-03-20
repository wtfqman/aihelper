const { generateAiResponse } = require('../services/aiService');
const { sendSafeLongMessage, sendSafeMessage } = require('../services/telegramService');
const logger = require('../utils/logger');

const AI_ERROR_MESSAGE = 'Произошла ошибка при обращении к AI. Попробуйте позже.';

function getUserText(ctx) {
  return ctx && ctx.message && typeof ctx.message.text === 'string'
    ? ctx.message.text.trim()
    : '';
}

async function handleText(ctx) {
  try {
    const userText = getUserText(ctx);
    const aiResponse = await generateAiResponse(userText);
    await sendSafeLongMessage(ctx, aiResponse);
  } catch (error) {
    logger.error(`Error in text handler: ${error.message}`);
    await sendSafeMessage(ctx, AI_ERROR_MESSAGE);
  }
}

function registerTextHandler(bot) {
  bot.on('text', handleText);
}

module.exports = {
  handleText,
  registerTextHandler
};
