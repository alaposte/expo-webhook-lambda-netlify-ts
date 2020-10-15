import { APIGatewayEvent } from 'aws-lambda';
import { StatusCodes } from 'http-status-codes';

export async function handler(event: APIGatewayEvent) {
  const { name = 'test' } = event.queryStringParameters;
  if (event.httpMethod === 'POST') {
    console.log('headers', event.headers);
    console.log('body', event.body);
    return {
      statusCode: StatusCodes.OK,
      body: event.body
    };
  }
  return {
    statusCode: StatusCodes.OK,
    body: JSON.stringify({ name })
  };
}
