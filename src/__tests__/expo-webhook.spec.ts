import { apiGatewayEventMock } from '@schedulino/aws-lambda-test-utils';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import { Response } from 'node-fetch';

import NodeFetcher from '../utils/fetcher';
import { handler } from '../expo-webhook';

const originalEnv = process.env;

describe('expo-webhook', () => {
  describe('handler function', () => {
    describe('NOT a POST request', () => {
      it('[ERROR] send a 403', async () => {
        const eventMock = apiGatewayEventMock();
        const response = await handler(eventMock);
        expect(response.statusCode).toEqual(StatusCodes.FORBIDDEN);
        expect(response.body).toContain(getReasonPhrase(StatusCodes.FORBIDDEN));
      });
    });
    describe('POST request', () => {
      beforeAll(() => {
        process.env = { ...originalEnv };
      });
      it('[ERROR] returns an error response with 204 if no body or no expo-signature header', async () => {
        const eventMock = apiGatewayEventMock();
        eventMock.httpMethod = 'POST';
        const response = await handler(eventMock);
        expect(response.statusCode).toEqual(StatusCodes.NOT_ACCEPTABLE);
        expect(response.body).toContain(
          getReasonPhrase(StatusCodes.NOT_ACCEPTABLE)
        );
        eventMock.body = `{ test: 'test' }`;
        expect(response.statusCode).toEqual(StatusCodes.NOT_ACCEPTABLE);
        expect(response.body).toContain(
          getReasonPhrase(StatusCodes.NOT_ACCEPTABLE)
        );
        eventMock.headers = {
          ...eventMock.headers,
          'expo-signature': 'test-expo-signature'
        };
        expect(response.statusCode).toEqual(StatusCodes.NOT_ACCEPTABLE);
        eventMock.body = '';
        expect(response.body).toContain(
          getReasonPhrase(StatusCodes.NOT_ACCEPTABLE)
        );
      });
      it('[ERROR] returns an error with 417 if the header "expo-signature" is not present in the headers ', async () => {
        process.env.EXPO_WEBHOOK_SECRET = 'unmatchin-test-secret-first';
        const eventMock = apiGatewayEventMock();
        eventMock.httpMethod = 'POST';
        eventMock.body = `qdrhqrqtrntr`;
        eventMock.headers = {
          'dummy-header': 'test-dummy'
        };
        const response = await handler(eventMock);
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(response.body).toContain(
          getReasonPhrase(StatusCodes.UNAUTHORIZED)
        );
      });
      it('[ERROR] returns an error with 401 if the signature and the body hash don\t match ', async () => {
        process.env.EXPO_WEBHOOK_SECRET = 'unmatchin-test-secret-second';
        const eventMock = apiGatewayEventMock();
        eventMock.httpMethod = 'POST';
        eventMock.body = `qdrhqrqtrntr`;
        eventMock.headers = {
          ...eventMock.headers,
          'expo-signature': 'test-expo-signature'
        };
        const response = await handler(eventMock);
        expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
        expect(response.body).toContain(
          getReasonPhrase(StatusCodes.UNAUTHORIZED)
        );
      });
      it('[NO ERROR] returns a response with 200', async () => {
        process.env.EXPO_WEBHOOK_SECRET =
          '0158404e303a504e2ec2fc7bedd6cbe332bc29f2';
        const eventMock = apiGatewayEventMock();
        eventMock.httpMethod = 'POST';
        eventMock.body = `{ "msg": "sha1-valid-test-hash" }`;
        eventMock.headers = {
          ...eventMock.headers,
          'expo-signature': 'sha1=f1d7e09e0c8781aaba708be3aea8e13ed0e925cd'
        };
        const spy = jest.fn((url: string, body: BodyInit) => {
          return Promise.resolve(new Response());
        });
        NodeFetcher.POST = spy;
        const response = await handler(eventMock);
        expect(spy).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toEqual(StatusCodes.OK);
        expect(JSON.parse(response.body)).toMatchObject({
          msg: 'sha1-valid-test-hash'
        });
      });
    });
  });
});
