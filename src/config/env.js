const dotenv = require('dotenv');

function readRequiredEnv(name) {
  const value = process.env[name];

  if (!value || !value.trim()) {
    throw new Error(
      `Переменная окружения ${name} обязательна. Добавьте ее в .env или задайте перед запуском приложения.`
    );
  }

  return value.trim();
}

function loadEnv() {
  const result = dotenv.config({ quiet: true });

  if (result.error && result.error.code !== 'ENOENT') {
    throw result.error;
  }

  return {
    botToken: readRequiredEnv('BOT_TOKEN'),
    geminiApiKey: readRequiredEnv('GEMINI_API_KEY')
  };
}

module.exports = {
  loadEnv
};
