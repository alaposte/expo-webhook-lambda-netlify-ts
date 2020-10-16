import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { LambdaResponse } from './types';

export const createSuccessResponse = (
  body: Record<string, unknown>
): LambdaResponse => {
  return createResponse(StatusCodes.OK, body);
};

export const createErrorResponse = (code: number): LambdaResponse => {
  return createResponse(code, [getReasonPhrase(code)]);
};

export const createResponse = (
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
