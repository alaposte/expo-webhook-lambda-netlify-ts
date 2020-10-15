import { URLSearchParams } from 'url';
import fetch, { Response } from 'node-fetch';

export interface IFetcher {
  GET: (url: string, body: any) => Promise<Response>;
  POST: (url: string, body: any) => Promise<Response>;
}

const NodeFetcher: IFetcher = {
  GET: (url: string, body: any) => {
    return fetch(url, {
      method: 'GET',
      body: new URLSearchParams(body)
    });
  },
  POST: (url: string, body: any, headers = {}) => {
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      }
    });
  }
};

export default NodeFetcher;
