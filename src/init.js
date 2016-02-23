import { makeLogger } from './utils'
const { info } = makeLogger('init')

import { connect } from 'coffea'
import { loadPlugin, applyPlugin } from './plugin'
import { handleCommands } from './commands'

export default function init (config) {
  const networks = connect(config.networks)
  info(`coffea connected to ${networks.length} network/s`)

  if (config.plugins) {
    const plugins = config.plugins.map(loadPlugin)
    const { commands } = plugins.reduce(applyPlugin, networks)

    networks.on('command', handleCommands(commands))
  }
}
