export const VERSION = '0.1.0'

const parseMessage = (dispatch, prefix, delimiter = ' ') => (e, reply) => {
  const { text } = e

  if (!text || !text.startsWith(prefix)) return
  const textWithoutPrefix = text.slice(prefix.length)

  const args = textWithoutPrefix.split(delimiter)

  dispatch({
    ...e,
    type: 'command',
    cmd: args.shift(),
    args: args
  })
}

export default function commandparser (networks, config) {
  if (!config.prefix) throw new Error('commandparser: `prefix` property not found in plugin configuration')
  console.log('commandparser plugin v' + VERSION + ' initialized')

  const dispatch = (e) => networks.dispatch(e)

  networks.on('message', parseMessage(dispatch, config.prefix))
}
