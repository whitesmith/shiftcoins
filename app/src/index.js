const restify = require('restify')
const logger = require('morgan')
const handler = require('./handler.js');

// get env.
let VERIFY_TOKEN = process.env.SLACK_TOKEN
let PORT = process.env.PORT || 8080
if (!VERIFY_TOKEN) {
  console.error('SLACK_TOKEN is required')
  process.exit(1)
}

// build server
let server = restify.createServer()
server.use(logger('tiny'))
server.use(restify.plugins.bodyParser({
  mapParams: true
}));

// wait for messages.
server.post('/', function (req, res) {
  if (req.params.token !== VERIFY_TOKEN) {
    return res.send(401, 'Unauthorized')
  }
  handler.commandHandler(req, res)
})

// 🔥 it up.
server.listen(PORT, function (err) {
  if (err) {
    return console.error('Error starting server: ', err)
  }
  console.log('Server successfully started on port %s', PORT)
})
