let express = require('express')
const bodyParser = require('body-parser')
import {getEtherBalance} from './ethereum'

const COMMAND = '/wallet'

let app = express()
app.use(bodyParser.urlencoded({extended: true}))

app.post('/', function (req, res) {
    if(!req.body.token) {
        returnres.status(422).send("token must be present")
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
        balance(req, res, args);
    } else if(operation === 'transfer') {
        res.send('transfer')
    } else if(operation === 'export') {
        res.send('export')
    } else {
        res.status(422).send('operation "' + operation + '" not found')
    }
})

function balance(req, res, args) {
    try {
        getEtherBalance(args[1]).then(result => { //this is when a promise is resolved (returns any value besides a reject)
            res.send(result)
        }).catch(err => { //This catch is for rejected promises, usually errors we can somehow handle
            res.status(400).send(err.message)
        })
    }
    catch(err) { //This catch is for thrown errors, usually unexpected errors
        res.status(500).send(err.message)
    }
}

export {app as default, COMMAND};