const mod = await import('../../dist/server/server.js')
const server = mod.default || mod

export const handler = (event: any, context: any) => {
  return server(event, context)
}