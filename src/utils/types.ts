export type LambdaResponse = {
  statusCode: number;
  headers?: { [name: string]: string };
  body: string;
};
