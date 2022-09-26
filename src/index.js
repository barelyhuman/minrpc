/**
 * @type {import("./index").createRPCHandler}
 */
export function createRPCHandler(methods) {
  if (methods['_methods']) {
    throw new Error(
      'the method `_methods` will be overriden by [minrpc], please choose a different method name'
    )
  }
  const _methods = Object.assign(methods, {
    _methods: () => {
      return {
        methods: Object.keys(methods),
      }
    },
  })

  return async (req, res) => {
    try {
      if (String(req.url).endsWith('_methods')) {
        const response = _methods['_methods']()
        send(res, 200, { response })
        return
      }

      if (['post'].indexOf(req.method.toLowerCase()) == -1) {
        send(
          res,
          406,
          error('unaccepted HTTP method, only POST requests allowed')
        )
        return
      }

      const body = await parseJSONRequest(req)
      if (!_methods[body.method]) {
        return send(
          res,
          400,
          error('make sure the method is registered on the server')
        )
      }
      const response = await _methods[body.method](body.params)
      send(res, 200, { response })
      return
    } catch (err) {
      return send(res, 500, {
        message: 'Oops! Something went wrong...',
      })
    }
  }
}

function send(res, status = 200, data = {}) {
  res.statusCode = status
  res.write(serialize(data))
  res.end()
  return
}

function error(message) {
  return JSON.stringify({
    error: message,
  })
}

function serialize(json) {
  return JSON.stringify(json, null, 2)
}

function parseJSONRequest(req) {
  let data = ''
  return new Promise((resolve, reject) => {
    req.on('data', chunk => {
      data += chunk
    })
    req.on('end', () => {
      resolve(JSON.parse(data))
    })
    req.on('error', err => {
      reject(err)
    })
  })
}
