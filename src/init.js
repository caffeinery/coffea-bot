import { makeLogger } from './utils'
const { debug } = makeLogger('init')

import { connect } from 'coffea'

export default function init (config) {
  const networks = connect(config.networks)
  debug('networks: ' + JSON.stringify(networks))
}
