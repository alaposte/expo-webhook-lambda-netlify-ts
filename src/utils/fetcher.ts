import fetch, { Response } from 'node-fetch';

export interface IFetcher {
  GET: (url: string) => Promise<Response>;
  POST: (url: string, body: any) => Promise<Response>;
}

const NodeFetcher: IFetcher = {
  GET: (url: string) => {
    return fetch(url, { method: 'GET' });
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
