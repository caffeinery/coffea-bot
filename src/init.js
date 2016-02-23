import { makeLogger } from './utils'
const { info } = makeLogger('init')

import { connect } from 'coffea'
import { loadPlugin, applyPlugin } from './plugin'
import { handleCommands } from './commands'

export default function init (config) {
  const networks = connect(config.networks)
  info(`coffea connected to ${networks.length} network/s`)

  if (config.plugins) {
    // loadPlugin: (config) => (name) => enhanced plugin function
    const plugins = Object.keys(config.plugins).map(loadPlugin(config))
    const { commands } = plugins.reduce(applyPlugin, networks)

    networks.on('command', handleCommands(commands))
  }
}
