export const VERSION = '1.0.0'

import { message } from 'coffea'

const callAndReply = (fn, text) =>
  (e, reply) => {
    if (fn) fn()
    else console.warn('WARNING: function passed to `callAndReply` was undefined')
    reply(message(e.channel, text))
  }

const justReply = (text) =>
  (e, reply) => reply(message(e.channel, text))

export default function log (networks) {
  console.log('log plugin v' + VERSION + ' initialized')

  let stopSubscription

  const unsubscribe = () => {
    if (stopSubscription) stopSubscription()
    stopSubscription = undefined
  }

  const subscribe = () => {
    if (!stopSubscription) {
      stopSubscription = networks.on('event', e => console.log('event:', e))
    }
  }

  subscribe()

  return {
    'disable': callAndReply(unsubscribe, 'Disabled logging.'),
    'enable': callAndReply(subscribe, 'Enabled logging.'),
    'default': justReply('Usage: log disable|enable')
  }
}
