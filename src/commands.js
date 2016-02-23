import { makeLogger } from './utils'
const { debug } = makeLogger('commands')

const parseCommand = (commands, cmd, args) => {
  debug(`parsing command (${cmd} - ${args}): ` + JSON.stringify(commands))

  if (commands.hasOwnProperty(cmd)) {
    if (typeof commands[cmd] === 'function') {
      // we found a function, terminate...
      debug('command handler function found: ' + commands[cmd].name)
      return commands[cmd]
    }

    // parse command subtree
    let newCmd = args.shift()
    return parseCommand(commands[cmd], newCmd, args)
  } else if (commands.hasOwnProperty('default')) {
    // fallback to `default` if no other command was matched
    debug('using default command handler')
    return commands['default']
  } else {
    debug('command not found: ' + cmd)
    return (e, reply) => reply('command not found') // TODO: make this customizable
  }
}

export const handleCommands = (commands) => (event, reply) => {
  const { cmd, args } = event
  debug(`command: ${cmd} (args: ${args})`)

  const f = parseCommand(commands, cmd, args)

  return f(event, reply)
}
