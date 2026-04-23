import server from '../../dist/server/server.js';

export const handler = async (event: any, context: any) => {
  return server(event, context)
}