import { makeLogger } from './utils'
const { debug, info } = makeLogger('index')

import config from '../config'
import init from './init'

info('Initializing coffea-bot...')
debug('config: ' + JSON.stringify(config))
init(config)
