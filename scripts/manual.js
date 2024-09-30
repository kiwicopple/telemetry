const http = require('http')

const options = {
  hostname: '127.0.0.1',
  port: 55680,
  path: '/v1/traces',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
}

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`)
  res.setEncoding('utf8')
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`)
  })
  res.on('end', () => {
    console.log('No more data in response.')
  })
})

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`)
})

// Write data to request body
req.write('{}')
req.end()
