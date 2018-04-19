let express = require('express')
const bodyParser = require('body-parser')

let app = express()
app.use(bodyParser.urlencoded({extended: true}))

app.post('/', function (req, res) {
    if(!req.body.token) {
        res.status(422).send("token must be present")
    }
    if(!req.body.command) {
        res.status(422).send("command must be present")
    }
    let command = req.body.command

    if(command === '/help') {
        res.send('/help')
    } else if(command === '/wallet') {
        res.send('/wallet')
    }

    res.status(422).send('command "' + command + '" not found')
})

module.exports = app