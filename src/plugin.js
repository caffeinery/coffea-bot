import { makeLogger } from './utils'
const { debug, info, error } = makeLogger('plugin')

import { defaultImport } from 'coffea'

const importPlugin = (name) => {
  try {
    debug(`Trying to load plugin "${name}" from plugins/`)
    return defaultImport(require('../plugins/' + name))
  } catch (e) {
    debug(`Plugin "${name}" not found in plugins/, trying to load from npm`)
    try {
      return defaultImport(require(name))
    } catch (e2) {
      error(`Plugin "${name}" not found in plugins/ or node_modules/`)
      throw new Error(`The plugin "${name}" isn't installed. Try running: npm install --save ${name}`)
    }
  }
}

export const loadPlugin = (config) => (name) => {
  info(`Attempting to load the plugin "${name}"`)

  const plugin = importPlugin(name)

  info(`Plugin "${name}" loaded`)
  plugin.pluginName = name
  plugin.config = config.plugins[name]
  return plugin
}

export const applyPlugin = (networks, plugin) => {
  const name = plugin.pluginName
  debug(`Applying plugin ${name}`)

  const commands = plugin(networks, plugin.config)

  if (commands) {
    debug(`Registering commands exported by "${name}" plugin: ${Object.keys(commands)}`)

    if (!networks.commands) networks.commands = {}
    networks.commands[name] = commands
  }

  return networks
}
