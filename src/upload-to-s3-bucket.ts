import { APIGatewayEvent } from 'aws-lambda';
import s3 from 'aws-sdk/clients/s3';
import { StatusCodes } from 'http-status-codes';
import { telegramLambdaUrl } from './utils/constants';
import NodeFetcher from './utils/fetcher';
import { createErrorResponse, createSuccessResponse } from './utils/responses';
import {
  AWS_S3_ACCESS_KEY_ID as accessKeyId,
  AWS_S3_SECRET_ACCESS_KEY as secretAccessKey,
  AWS_S3_BUCKET_NAME as bucketName
} from './utils/constants';

const fileName = 'sestrel-app.apk';

export async function handler({ body }: APIGatewayEvent) {
  if (!body) {
    return createErrorResponse(StatusCodes.NOT_ACCEPTABLE);
  }
  try {
    const { artifactUrl } = JSON.parse(body);
    const { body: stream } = await NodeFetcher.GET(artifactUrl);
    const bucket = new s3({
      credentials: { accessKeyId, secretAccessKey },
      region: 'eu-central-1'
    });
    const res = await bucket
      .upload({
        Bucket: bucketName,
        Key: fileName,
        Body: stream,
        ACL: 'public-read'
      })
      .promise();
    await NodeFetcher.POST(telegramLambdaUrl, { ...JSON.parse(body), ...res });
    return createSuccessResponse({ ...res });
  } catch (err) {
    console.log('upload-to-s3-bucket:handler error: ', err);
    await NodeFetcher.POST(telegramLambdaUrl, { errors: [err.message] });
    return createErrorResponse(StatusCodes.BAD_REQUEST);
  }
}
