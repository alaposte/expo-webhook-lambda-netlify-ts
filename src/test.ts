import { APIGatewayEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

export async function handler(event: APIGatewayEvent) {
  const { name = 'test' } = event.queryStringParameters;
  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify({ name })
  };
}
