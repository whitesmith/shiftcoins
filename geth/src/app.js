let express = require('express')
const bodyParser = require('body-parser')
const request = require('request');
import config from './config'
import {getAddress, getEtherBalance, register, getBalance, transfer, watchTransfers} from './ethereum'

const COMMAND = '/wallet'

let app = express()
app.use(bodyParser.urlencoded({extended: true}))

app.post('/', function (req, res) {
    if(!req.body.token) {
        returnres.status(401).send("token must be present")
    }
    if(req.body.token !== config.slack_token) {
        returnres.status(401).send("invalid token received")
    }
    if(!req.body.command) {
        res.send(buildError("Invalid command", "Please use help to see available commands."))
    }
    if(req.body.command !== COMMAND) {
        res.send(buildError("Invalid command", "Please use help to see available commands."))
    }
    let text = req.body.text || '';
    let args = text.split(' ')
    let operation = args[0]

    // handle commands.
    switch (operation) {
        case 'help':
            Help(req, res, args);
            break;
        case 'ether':
            GetEtherBalance(req, res, args);
            break;
        case 'register':
            Register(req, res, args);
            break;
        case 'balance':
            GetBalance(req, res, args)
            break;
        case 'transfer':
            Transfer(req, res, args)
            break;
        case "address":
            GetAddress(req, res, args)
            break;
        case "events":
            Events(req, res, args)
            break;
        default:
            res.send(buildError("Invalid command", "Please use help to see available commands."))
    }
})


/*
    command handlers.
*/
function Help(req, res, args) {
    res.send('Valid commands: help, register, balance, transfer, address.\n' +
        '\t- /wallet register    - Will create your ShiftCoin wallet.\n' +
        '\t- /wallet balance    - Will tell you how many ShiftCoins you have.\n' +
        '\t- /wallet transfer [@username] [value]    - Will allow you to send ShiftCoins to another wallet.\n' +
        '\t- /wallet address    - Will tell you your ethereum wallet address.')
}

function GetEtherBalance(req, res, args) {
    let target_username;
    if(args.length < 2) {
        target_username = req.body.user_name;
    } else {
        target_username = args[1].replace(/^@/, '');
    }

    try {
        getAddress(target_username).then(address =>
        getEtherBalance(address)).then(balance => {
            if (target_username === req.body.user_name) {
                res.send(buildResponse("Success", `You own *${balance}* ether.`))
            } else {
                res.send(buildResponse("Success", `_${target_username}_ owns *${balance}* ether.`))
            }
        }).catch(err => {
            console.log(err.message);
            res.send(buildError("Failed", err))
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

function Register(req, res, args) {
    res.send(buildPending())
    try {
        register(req.body.user_name, req.body.user_id).then(tx => {
            sendDelayed(req.body.response_url, buildResponse("Welcome", `You are now registered as _${req.body.user_name}_.\n Please check the help comand to start using your ShiftCoins.`))
        }).catch(err => {
            console.log(err.message);
            sendDelayed(req.body.response_url, buildError("Failed", "Registration failed, please request help from the staff!"))
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

function GetBalance(req, res, args) {
    let target_username;
    if(args.length < 2) {
        target_username = req.body.user_name;
    } else {
        target_username = args[1].replace(/^@/, '');
    }

    try {
        getAddress(target_username).then(address =>
        getBalance(address)).then(balance => {
            if (target_username === req.body.user_name) {
                res.send(buildResponse("Success", `You own *${balance}* ShiftCoins.`))
            } else {
                res.send(buildResponse("Success", `_${target_username}_ owns *${balance}* ShiftCoins.`))
            }
        }).catch(err => {
            console.log(err.message);
            res.send(buildError("Failed", err))
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

function Transfer(req, res, args) {
    res.send(buildPending())
    if(args.length < 3) {
        res.send(buildError("Failed", "Please provide username and value for transfer."));
        return
    }
    let target_username = args[1].replace(/^@/, '');
    try {
        getAddress(req.body.user_name).then(from_address => {
            getAddress(target_username).then(to_address =>
            transfer(from_address, to_address, args[2])).then(tx => {
                sendDelayed(req.body.response_url, buildResponse("Success", `You transferred *${args[2]}* ShiftCoins to _${target_username}_.`))
            }).catch(err => {
                console.log(err.message);
                sendDelayed(req.body.response_url, buildError("Failed", "Transfer failed."))
            })
        }).catch(err => {
            console.log(err.message);
            sendDelayed(req.body.response_url, buildError("Failed", "Transfer failed."))
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

function GetAddress(req, res, args) {
    let target_username;
    if(args.length < 2) {
        target_username = req.body.user_name;
    } else {
        target_username = args[1].replace(/^@/, '');
    }

    try {
        getAddress(target_username).then(address => {
            if (target_username === req.body.user_name) {
                res.send(buildResponse("", `Your wallet address is _${address}_.`))
            } else {
                res.send(buildResponse("", `_${target_username}_'s wallet address is *${address}*.`))
            }
        }).catch(err => {
            console.log(err.message);
            res.send(buildError("Failed", "Could not fetch address."))
        })
    }
    catch(err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}

function Events(req, res, args) {
    let target_username;
    if(args.length < 2) {
        target_username = req.body.user_name;
    } else {
        target_username = args[1].replace(/^@/, '');
    }

    try {
        getAddress(target_username).then(address =>
        watchTransfers(address, function (event) {
            sendDelayed(req.body.response_url, buildResponse("New Transfer", `Received *${event.value}* ShiftCoins.`))
        })).catch(err => {
            res.send(err.message)
        })
        res.send(buildResponse("", "Waiting for events..."));
    }
    catch(err) {
        console.log(err)
        res.status(500).send(err.message)
    }
}


/*
    Slack responses
 */
function buildResponse(title, text) {
    return {
        attachments: [{
            color: 'good',
            title: title,
            text: text,
            mrkdwn_in: ['text']
        }]}
}

function buildError(title, text) {
    return {
        attachments: [{
            color: 'danger',
            title: title,
            text: text,
            mrkdwn_in: ['text']
        }]}
}

function buildPending() {
    return {
        attachments: [{
            color: '#4682B4',
            text: "executing transaction...",
            mrkdwn_in: ['text']
        }]}
}

function sendDelayed(url, body) {
    request({url: url, method: "POST", json: body})
}

export {app as default, COMMAND};
