const {
  EXPO_WEBHOOK_SECRET = '104691c666dc295b2cf639e9141d7d510821e422614106f6201e9a7621b7',
  NETLIFY_APP_FUNCTIONS_URL = 'http://localhost:8888/.netlify/functions',
  AWS_S3_ACCESS_KEY_ID = 'AKIAZZMBZYP2N4PGPIMW',
  AWS_S3_SECRET_ACCESS_KEY = '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',
  AWS_S3_BUCKET_NAME = 'sestrel-apk-bucket',
  SECRET_TELEGRAM_BOT_TOKEN = '631936784:AAHdSWx-zBXO3aaDa323U4BQqTQ0msKMcKA',
  SECRET_TELEGRAM_BOT_CHAT_ID = '-277772522'
} = process.env;

const telegramLambdaUrl = `${NETLIFY_APP_FUNCTIONS_URL}/telegram-notifier`;
const sestrelS3BucketUrl = `${NETLIFY_APP_FUNCTIONS_URL}/upload-to-s3-bucket`;

export {
  telegramLambdaUrl,
  sestrelS3BucketUrl,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  EXPO_WEBHOOK_SECRET,
  SECRET_TELEGRAM_BOT_TOKEN,
  SECRET_TELEGRAM_BOT_CHAT_ID
};
