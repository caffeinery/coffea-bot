import { makeLogger } from './utils'
const { debug, info } = makeLogger('commands')

export const handleCommands = (commands) => (event, reply) => {
  const { cmd, args } = event
  debug(`command: ${cmd} (args: ${args})`)

  // TODO
}
