# coffea-bot

_a bot framework for [coffea 1.0-beta](https://github.com/caffeinery/coffea/tree/1.0-beta)
using [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html) for plugins_

**work-in-progress**

This is not a finished project yet, [there are a few proposals](https://github.com/caffeinery/coffea-bot/issues) that need to be thought through and implemented.


## Installation

First you need to clone the repository to get the latest version of the bot.

```
git clone https://github.com/caffeinery/coffea-bot my_bot
cd my_bot
```

Now you can install the dependencies (in the bot directory):

```
npm install
```


## Configuration

Create a `config.json` file:

```js
{
  "name": "my_bot",
  "plugins": {
    "log": {},
    "commandparser": { "prefix": "." }
  },
  "networks": [
    {
      "protocol": "slack",
      "token": "SLACK_BOT_TOKEN_HERE"
    }
  ]
}
```

**Note:** The `networks` config will be passed directly to [coffea's connect
function](https://github.com/caffeinery/coffea/tree/1.0-beta#connecting).

Don't forget to install the protocol (e.g. `npm install --save coffea-slack`)


## Running

Just run (in the bot directory):

```
npm start
```


## Installing plugins

Install them via npm:

```
npm install --save plugin-name
```

(or add them to the `plugins/` folder)

and then include them in your config:

```js
{
  "name": "my_bot",
  "plugins": {
    "plugin-name": {}
  },
  "networks": [
    {
      "protocol": "slack",
      "token": "SLACK_BOT_TOKEN_HERE"
    }
  ]
}
```

### Configuring plugins

Plugins can be configured by adding properties to the empty object:

```js
"plugins": {
  "commandparser": { "prefix": "." }
}
```


## Writing your own plugins

You can also put plugins into a `plugins/` folder. coffea-bot will look in that
folder first before searching for the plugin in `node_modules/` (this is where
`npm` installs them).

 * Create `plugins/PLUGINNAME.js`, e.g. `plugins/test.js`
 * Add the plugin to the `plugins` object in the config, e.g. `"plugins": { "test": {} }`

coffea-bot uses [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html),
plugins are simply functions that get passed a [coffea instance container (`networks`)](https://github.com/caffeinery/coffea/tree/1.0-beta#connecting) and
their configuration. They return an object mapping commands to
*command handlers*, which are functions that get passed `event` and `reply`
(just like [coffea event listeners](https://github.com/caffeinery/coffea/tree/1.0-beta#listening-on-events)).

 * Edit `plugins/PLUGINNAME.js` and type:

```js
export default function pluginName (networks, config) {
  return {
    'hello': (event, reply) => reply('hello world!')
  }
}
```

You can also extract your handler functions (e.g. if they're more complicated):

```js
export default function pluginName (networks, config) {
  const handleHello = (event, reply) => reply('hello world!')

  return { 'hello': handleHello }
}
```

### Listening to other events

You can [listen to other coffea events](https://github.com/caffeinery/coffea/tree/1.0-beta#listening-on-events)
by accessing `networks`, which is a [coffea instance container](https://github.com/caffeinery/coffea/tree/1.0-beta#connecting).

```js
export default function logger (networks) {
  networks.on('event', (e) => console.log(e)) // log all events
}
```

### Nested commands

coffea-bot has built-in support for nested commands. You can return a command
tree of any depth in your plugin functions. The root command is the name of the
plugin.

e.g. if you want to make `/hello world`:

```js
// hello.js
export default function hello () {
  const handleHelloWorld = (event, reply) => reply('hello world!')
  const notEnoughArgumentsError = (event, reply) => reply('not enough arguments.')

  return {
    'world': handleHelloWorld
    'default': notEnoughArgumentsError
  }
}
```

Now you can try this out:

```
> /hello
< not enough arguments
> /hello world
< hello world!
```

### Parsing arguments

After nested commands are matched and processed, the rest of the arguments are
forwarded to the handler function in the `event` object as `event.args`.

```js
// hello.js
export default function hello () {
  const handleHello = (event, reply) => {
    if (event.args.length > 0) reply(`hello ${event.args[0]}!`)
    else reply('not enough arguments.')
  }

  return handleHello
}
```

```
> /hello
< not enough arguments
> /hello destiny
< hello destiny!
```

### Plugin configuration

Plugins can be [configured via `config.json`](#configuring-plugins). This
configuration gets passed as a second argument to the plugin function:

```js
// hello.js
export default function hello (networks, config) {
  const handleHello = (event, reply) => {
    if (event.args.length > 0) reply(`${config.greeting} ${event.args[0]}!`)
    else reply('not enough arguments.')
  }

  return handleHello
}
```

with the following config:

```
"plugins": {
  "hello": { "greeting": "hi" }
}
```

```
> /hello destiny
< hi destiny!
```
