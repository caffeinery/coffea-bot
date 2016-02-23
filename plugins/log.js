export const VERSION = '1.0.0'

const callAndReply = (unsubscribe, text) =>
  (e, reply) => {
    unsubscribe()
    reply(text)
  }

const justReply = (text) => (e, reply) => reply(text)

export default function log (networks) {
  console.log('log plugin v' + VERSION + ' initialized')

  let unsubscribe
  const subscribe = () => {
    unsubscribe = networks.on('event', e => console.log('event:', e))
  }

  return {
    'disable': callAndReply(unsubscribe, 'Disabled logging.'),
    'enable': callAndReply(unsubscribe, 'Enabled logging.'),
    'default': justReply('Usage: /log disable|enable')
  }
}
