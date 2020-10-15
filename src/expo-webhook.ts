import { APIGatewayEvent /*, Callback, Context*/ } from 'aws-lambda';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import safeCompare from 'safe-compare';

import NodeFetcher from './utils/fetcher';

type LambdaResponse = {
  statusCode: number;
  headers?: { [name: string]: string };
  body: string;
};

const defaultTelegramLambdaUrl =
  'http://localhost:8888/.netlify/functions/telegram-notifier';
const telegramLambdaUrl =
  process.env.TELEGRAM_BOT_LAMBDA_URL || defaultTelegramLambdaUrl;
const webhookSecret = process.env.EXPO_WEBHOOK_SECRET;

export async function handler(
  event: APIGatewayEvent
  /* context: Context, callback: Callback*/
): Promise<LambdaResponse> {
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(StatusCodes.FORBIDDEN);
  }
  try {
    const { body, headers } = event;
    if (!body || !webhookSecret) {
      return createErrorResponse(StatusCodes.NOT_ACCEPTABLE);
    }
    const hmac = crypto.createHmac('sha1', webhookSecret).update(body);
    const hash = `sha1=${hmac.digest('hex')}`;
    const expoSignature = headers['expo-signature'];
    if (!safeCompare(expoSignature, hash)) {
      return createErrorResponse(StatusCodes.UNAUTHORIZED);
    }
    const parsed = JSON.parse(body);
    // TODO: await upload to S3 bucket
    await NodeFetcher.POST(telegramLambdaUrl, {
      message: 'tranfering the artifact to the S3 bucket',
      ...parsed
    });
    return createSuccessResponse({ ...parsed });
  } catch (e) {
    console.log(e);
    return createErrorResponse(StatusCodes.EXPECTATION_FAILED);
  }
}

const createSuccessResponse = (body: Record<string, unknown>) => {
  return createResponse(StatusCodes.OK, body);
};

const createErrorResponse = (code: number) => {
  return createResponse(code, [getReasonPhrase(code)]);
};

const createResponse = (
  code: number,
  body: string[] | Record<string, unknown>,
  headers = {}
): LambdaResponse => {
  return {
    statusCode: code,
    body: JSON.stringify(body),
    headers: Object.assign(headers, { 'Content-Type': 'application/json' })
  };
};
