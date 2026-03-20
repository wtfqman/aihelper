const { GoogleGenAI } = require('@google/genai');
const logger = require('../utils/logger');

const MODEL_NAME = 'gemini-2.5-flash';
const EMPTY_USER_TEXT_RESPONSE = 'Пожалуйста, отправьте текстовое сообщение.';
const EMPTY_AI_RESPONSE = 'AI не смог сформировать ответ. Попробуйте переформулировать сообщение.';

let aiClient = null;

function getApiKey() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || !apiKey.trim()) {
    throw new Error('GEMINI_API_KEY is missing.');
  }

  return apiKey.trim();
}

function getAiClient() {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: getApiKey() });
  }

  return aiClient;
}

function extractResponseText(response) {
  if (!response) {
    return '';
  }

  if (typeof response.text === 'string') {
    return response.text.trim();
  }

  if (typeof response.text === 'function') {
    return String(response.text()).trim();
  }

  if (!Array.isArray(response.candidates)) {
    return '';
  }

  for (const candidate of response.candidates) {
    const parts = candidate &&
      candidate.content &&
      Array.isArray(candidate.content.parts)
      ? candidate.content.parts
      : [];

    const text = parts
      .map((part) => (part && part.text ? part.text : ''))
      .join('')
      .trim();

    if (text) {
      return text;
    }
  }

  return '';
}

async function generateAiResponse(userText) {
  const normalizedText = typeof userText === 'string' ? userText.trim() : '';

  if (!normalizedText) {
    return EMPTY_USER_TEXT_RESPONSE;
  }

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: normalizedText
    });

    const responseText = extractResponseText(response);

    if (!responseText) {
      return EMPTY_AI_RESPONSE;
    }

    return responseText;
  } catch (error) {
    logger.error(`Gemini request failed: ${error.message}`);
    throw error;
  }
}

module.exports = {
  generateAiResponse
};
