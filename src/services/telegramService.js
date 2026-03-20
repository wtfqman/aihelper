const logger = require('../utils/logger');
const TELEGRAM_TEXT_LIMIT = 4000;

function getChatId(ctx) {
  return ctx && ctx.chat ? ctx.chat.id : null;
}

function normalizeText(text) {
  if (typeof text === 'string') {
    return text;
  }

  if (text === null || text === undefined) {
    return '';
  }

  return String(text);
}

async function sendSafeMessage(ctx, text, extra = {}) {
  const chatId = getChatId(ctx);
  const messageText = normalizeText(text).trim();

  if (!chatId) {
    logger.error('Cannot send message: chat id was not found.');
    return false;
  }

  if (!messageText) {
    logger.error('Cannot send message: text is empty.');
    return false;
  }

  try {
    await ctx.telegram.sendMessage(chatId, messageText, extra);
    return true;
  } catch (error) {
    logger.error(`Failed to send message to chat ${chatId}: ${error.message}`);
    return false;
  }
}

function splitTextIntoChunks(text, maxLength = TELEGRAM_TEXT_LIMIT) {
  const sourceText = normalizeText(text).trim();

  if (!sourceText) {
    return [];
  }

  if (sourceText.length <= maxLength) {
    return [sourceText];
  }

  const chunks = [];
  let remainingText = sourceText;

  while (remainingText.length > maxLength) {
    let splitIndex = remainingText.lastIndexOf('\n', maxLength);

    if (splitIndex < maxLength / 2) {
      splitIndex = remainingText.lastIndexOf(' ', maxLength);
    }

    if (splitIndex < maxLength / 2) {
      splitIndex = maxLength;
    }

    const chunk = remainingText.slice(0, splitIndex).trim();

    if (!chunk) {
      chunks.push(remainingText.slice(0, maxLength));
      remainingText = remainingText.slice(maxLength).trim();
      continue;
    }

    chunks.push(chunk);
    remainingText = remainingText.slice(splitIndex).trim();
  }

  if (remainingText) {
    chunks.push(remainingText);
  }

  return chunks;
}

async function sendSafeLongMessage(ctx, text, extra = {}) {
  const chunks = splitTextIntoChunks(text);

  if (!chunks.length) {
    logger.error('Cannot send long message: text is empty.');
    return false;
  }

  for (const chunk of chunks) {
    const wasSent = await sendSafeMessage(ctx, chunk, extra);

    if (!wasSent) {
      return false;
    }
  }

  return true;
}

module.exports = {
  getChatId,
  sendSafeLongMessage,
  sendSafeMessage,
  splitTextIntoChunks
};
