# minrpc

A `node:http` middleware for working with a JSON RPC style worker/daemon.

> **Warning**: This isn't spec compliant with either versions of JSON RPC and
> follows no existing standard. Do not use it as a drop in replacement for any
> json rpc compliant libraries

## Installation

```sh
$ npm install @barelyhuman/minrpc
```

## Usage

### Setup

Here's a simple example of how to set this up. Post that, you can open the
browser to check if the methods got registered by calling on
`localhost:8000/_methods` or by sending a `POST` request with the following body

```json
{
	"method": "_methods"
}
```

```js
// in ESM
import http from 'node:http'
import { createRPCHandler } from 'minrpc'

// in CJS
const http = require('http')
const { createRPCHandler } = require('minrpc')

const methods = {
	greeting: ({ name }) => {
		return {
			greet: `Hello, ${name}`,
		}
	},
}

const server = http.createServer(createRPCHandler(methods))

server.on('clientError', (err, socket) => {
	socket.end('HTTP/1.1 400 Bad Request\r\n\r\n')
})

server.listen(8000)
```

### Client

There's no complicated logic involved in the first place, so you can just go
ahead and send the following body as a `POST` request and the server should
invoke the requested method accordingly.

```js
// client
fetch('http://localhost:8000', {
	method: 'POST',
	body: JSON.stringify({ method: 'greet', params: { name: 'reaper' } }),
})

// server method
const methods = {
	greet: ({ name }) => {
		return {
			greeting: `Hello, ${name}`,
		}
	},
}
```

### Standards

As mentioned above, there is no spec, it's based on a simple concept that you
maintain consistency on both sides, you send and receive JSON serializable data

## License

[MIT](license) &copy; [Reaper](https://reaper.is)
