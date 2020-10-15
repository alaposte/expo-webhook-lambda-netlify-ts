import { APIGatewayEvent /*, Callback, Context*/ } from 'aws-lambda';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import safeCompare from 'safe-compare';

type LambdaResponse = {
  statusCode: number;
  headers?: { [name: string]: string };
  body: string;
};

export async function handler(
  event: APIGatewayEvent
  /* context: Context, callback: Callback*/
): Promise<LambdaResponse> {
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(StatusCodes.FORBIDDEN);
  }
  try {
    const { body, headers } = event;
    if (!body || !process.env.EXPO_WEBHOOK_SECRET) {
      return createErrorResponse(StatusCodes.NO_CONTENT);
    }
    const hmac = crypto
      .createHmac('sha1', process.env.EXPO_WEBHOOK_SECRET)
      .update(body);
    const hash = `sha1=${hmac.digest('hex')}`;
    const expoSignature = headers['expo-signature'];
    if (!safeCompare(expoSignature, hash)) {
      return createErrorResponse(StatusCodes.UNAUTHORIZED);
    }
    const { msg } = JSON.parse(body);
    return createSuccessResponse({ msg });
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
