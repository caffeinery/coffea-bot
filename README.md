# coffea-bot

_a bot framework for [coffea 1.0-beta](https://github.com/caffeinery/coffea/tree/1.0-beta) using ES6 modules for plugins_

**WARNING: work-in-progress - not implemented yet!**


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

and then include them in your config:

```js
{
  "name": "my_bot",
  "plugins": [ "plugin-name" ],
  "networks": [
    {
      "protocol": "slack",
      "token": "SLACK_BOT_TOKEN_HERE"
    }
  ]
}
```


## Writing your own plugins

You can also put plugins into a `plugins/` folder. coffea-bot will look in that
folder first before searching for the plugin in `node_modules/` (this is where
`npm` installs them).

 * Create `plugins/PLUGINNAME.js`, e.g. `plugins/test.js`
 * Add the plugin to the `plugins` array in the config, e.g. `"plugins": [ "test" ]`

coffea-bot uses [ES6 modules](http://www.2ality.com/2014/09/es6-modules-final.html),
plugins are simply functions that get passed `event` and `reply` (just like
normal [coffea event listeners](https://github.com/caffeinery/coffea/tree/1.0-beta#listening-on-events)) and return an object that maps commands to handler functions.

 * Edit `plugins/PLUGINNAME.js` and type:

```js
export default function pluginName(networks) {
  return {
    'hello': (event, reply) => reply('hello world!')
  }
}
```

You can also extract your handler functions (e.g. if they're more complicated):

```js
export default function pluginName(networks) {
  const handleHello = (event, reply) => reply('hello world!')

  return { 'hello': handleHello }
}
```

### Listening to other events

You can [listen to other coffea events](https://github.com/caffeinery/coffea/tree/1.0-beta#listening-on-events)
by accessing `networks`, which is a [coffea instance container](https://github.com/caffeinery/coffea/tree/1.0-beta#connecting).

```js
export default function logger(networks) {
  networks.on('event', e => console.log(e)) // log all events
}
```

### Nested commands

coffea-bot has built-in support for nested commands. You can return a command
tree of any depth in your plugin functions.

e.g. if you want to make `/hello world`:

```js
export default function helloWorld() {
  const handleHelloWorld = (event, reply) => reply('hello world!')
  const notEnoughArgumentsError = (event, reply) => reply('not enough arguments.')

  return {
    'hello': {
      'world': handleHelloWorld
      'default': notEnoughArgumentsError
    }
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
export default function hello() {
  const handleHello = (event, reply) => {
    if (event.args.length > 0) reply(`hello ${event.args[0]}!`)
    else reply('not enough arguments.')
  }

  return {
    'hello': handleHello
  }
}
```

```
> /hello
< not enough arguments
> /hello destiny
< hello destiny!
```
