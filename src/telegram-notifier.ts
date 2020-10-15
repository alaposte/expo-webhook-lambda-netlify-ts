import { APIGatewayEvent } from 'aws-lambda';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import TeleBot from 'node-telegram-bot-api';

const {
  SECRET_TELEGRAM_BOT_TOKEN: token,
  SECRET_TELEGRAM_BOT_CHAT_ID: chatId
} = process.env;

export async function handler(event: APIGatewayEvent) {
  const { body, headers, httpMethod } = event;
  if (httpMethod !== 'POST') {
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
  const bot = new TeleBot(token);
  try {
    await bot.sendMessage(chatId, buildBotMessage(body, headers));
    return {
      statusCode: StatusCodes.OK,
      body: '',
      errors: null
    };
  } catch (e) {
    await bot.sendMessage(chatId, buildBotMessage(null, null, [e.message]));
    return {
      statusCode: StatusCodes.NOT_FOUND,
      errors: [e.message]
    };
  }
}

const buildBotMessage = (
  body: string | null,
  headers: any = {},
  errors: string[] = []
) => {
  if (errors.length > 0) {
    const errorsStr = JSON.stringify(errors, null, 2);
    return `Boom \u{1F4A3}:\nThe build failed\nErrors: ${errorsStr}`;
  }
  if (!body) {
    return 'Oups \u{1F61E}:\nThe build failed\nReason: The body content is empty';
  }
  const { status } = JSON.parse(body);
  let prefix = 'Success \u{2714}\n';
  if (status !== 'finished') {
    prefix = 'Failure \u{274C}\n';
  }
  const headersStr = JSON.stringify(headers, null, 2);
  return `${prefix}Headers:\n${headersStr}\nBody:\n${body}}`;
};
