let express = require('express')
const bodyParser = require('body-parser')

const COMMAND = '/wallet'

let app = express()
app.use(bodyParser.urlencoded({extended: true}))

app.post('/', function (req, res) {
    if(!req.body.token) {
        res.status(422).send("token must be present")
    }
    if(!req.body.command) {
        res.status(422).send("command must be present")
    }
    if(req.body.command !== COMMAND) {
        res.status(422).send('your command must start with "' + COMMAND + '"')
    }
    let text = req.body.text || '';
    let args = text.split(' ')
    let operation = args[0]

    if(operation === 'help') {
        res.send('help')
    } else if(operation === 'balance') {
        res.send('balance')
    } else if(operation === 'transfer') {
        res.send('transfer')
    } else if(operation === 'export') {
        res.send('export')
    }

    res.status(422).send('operation "' + operation + '" not found')
})

export {app as default, COMMAND};