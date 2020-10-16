import { APIGatewayEvent /*, Callback, Context*/ } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';
import crypto from 'crypto';
import safeCompare from 'safe-compare';

import NodeFetcher from './utils/fetcher';
import { sestrelS3BucketUrl } from './utils/constants';
import { LambdaResponse } from './utils/types';
import { createErrorResponse } from './utils/responses';
import { EXPO_WEBHOOK_SECRET as webhookSecret } from './utils/constants';

export async function handler(
  event: APIGatewayEvent
  /* context: Context, callback: Callback*/
): Promise<LambdaResponse> {
  if (event.httpMethod !== 'POST') {
    return createErrorResponse(StatusCodes.FORBIDDEN);
  }
  try {
    const { body, headers } = event;
    console.log('webhookSecret:', webhookSecret);
    console.log('body, headers:', body, headers);
    if (!body || !webhookSecret) {
      return createErrorResponse(StatusCodes.NOT_ACCEPTABLE);
    }
    const hmac = crypto.createHmac('sha1', webhookSecret).update(body);
    const hash = `sha1=${hmac.digest('hex')}`;
    const expoSignature = headers['expo-signature'];
    console.log('hash:', hash);
    console.log('sign:', expoSignature);
    if (!safeCompare(expoSignature, hash)) {
      return createErrorResponse(StatusCodes.UNAUTHORIZED);
    }
    const parsed = JSON.parse(body);
    // TODO: await upload to S3 bucket
    const resp = await NodeFetcher.POST(sestrelS3BucketUrl, {
      message: 'tranfering the artifact to the S3 bucket',
      ...parsed,
      ...headers
    });

    // return resp.json();

    const json = await resp.json();
    console.log('json response in expo-webhook lambda function:', json);
    return json;
  } catch (e) {
    console.log(e);
    return createErrorResponse(StatusCodes.EXPECTATION_FAILED);
  }
}
