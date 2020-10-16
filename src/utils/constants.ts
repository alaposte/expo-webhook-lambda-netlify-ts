const {
  EXPO_WEBHOOK_SECRET,
  NETLIFY_APP_FUNCTIONS_URL,
  AWS_S3_ACCESS_KEY_ID,
  AWS_S3_SECRET_ACCESS_KEY,
  AWS_S3_BUCKET_NAME,
  SECRET_TELEGRAM_BOT_TOKEN,
  SECRET_TELEGRAM_BOT_CHAT_ID
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
