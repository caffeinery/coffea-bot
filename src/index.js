import { makeLogger } from './utils'
const { debug, info } = makeLogger('index')

import config from '../config'
import init from './init'

import { version } from '../package.json'
export const VERSION = version

info('Initializing coffea-bot v' + VERSION)
debug('config: ' + JSON.stringify(config))
init(config)
