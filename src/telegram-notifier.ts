import { APIGatewayEvent } from 'aws-lambda';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Telegram } from 'telegraf';

const {
  SECRET_TELEGRAM_BOT_TOKEN: token,
  SECRET_TELEGRAM_BOT_CHAT_ID: chatId
} = process.env;

export async function handler(event: APIGatewayEvent) {
  console.log('event.body', event.body);
  console.log('event.headers', event.headers);
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: StatusCodes.UNAUTHORIZED,
      body: '',
      errors: [getReasonPhrase(StatusCodes.UNAUTHORIZED)]
    };
  }
  if (!token || !chatId) {
    return {
      statusCode: StatusCodes.PRECONDITION_FAILED,
      body: '',
      errors: [getReasonPhrase(StatusCodes.PRECONDITION_FAILED)]
    };
  }
  try {
    const bot = new Telegram(token);
    const msg = '';
    await bot.sendMessage(chatId, msg);
    return {
      statusCode: StatusCodes.OK,
      body: '',
      errors: null
    };
  } catch (e) {
    return {
      statusCode: StatusCodes.NOT_FOUND,
      errors: [e.message]
    };
  }
}
