const parser = require('./parser.js');

module.exports.commandHandler = function(req, res) {
  let cmd = parser.commandParser(req.body.text)
  let response = ""
  switch(cmd.command) {
    case "register":
      response = buildAnnouncement("New Player!", `Welcome ${req.body.user_name}!`)
      break;
    case "balance":
      response = buildResponse("Balance", `You currently own 3 shift coins!`)
      break;
    default:
      response = buildError("Error", `Please use a valid operation!`)
  }
  res.send(response)
}

function buildAnnouncement(title, text) {
  return {
    attachments: [{
      color: 'good',
      title: title,
      text: text,
      mrkdwn_in: ['text']
    }],
    response_type: "in_channel"
  }
}

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
