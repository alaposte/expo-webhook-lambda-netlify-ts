import { APIGatewayEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import TeleBot from 'node-telegram-bot-api';

import {
  SECRET_TELEGRAM_BOT_TOKEN as token,
  SECRET_TELEGRAM_BOT_CHAT_ID as chatId
} from './utils/constants';
import { createErrorResponse, createSuccessResponse } from './utils/responses';

export async function handler({ body, headers, httpMethod }: APIGatewayEvent) {
  if (httpMethod !== 'POST') {
    return createErrorResponse(StatusCodes.UNAUTHORIZED);
  }
  if (!token || !chatId) {
    return createErrorResponse(StatusCodes.PRECONDITION_FAILED);
  }
  if (!body) {
    return createErrorResponse(StatusCodes.EXPECTATION_FAILED);
  }
  const bot = new TeleBot(token);
  try {
    await bot.sendMessage(chatId, buildBotMessage(body, headers));
    const parsed = JSON.parse(body);
    return createSuccessResponse(parsed);
  } catch (e) {
    await bot.sendMessage(chatId, buildBotMessage(null, null, [e.message]));
    return createErrorResponse(StatusCodes.NOT_FOUND);
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
