# ShiftHappens Slack API

This is a simple API intended to use with slash commands in slack.

App: https://api.slack.com/apps/AA6JLUU9Y/

## Setup

1. Ensure you have Ruby installed and configured, with gem bundler installed as well
2. Run `bundle install`
3. Run `rerun ruby api.rb`
4. Make requests towards `localhost:4567`

## About

The API is served by a simple HTTP server called [Sinatra](http://sinatrarb.com/intro.html).

Use whatever API tools you want, but be sure to make requests in the format
slack does: https://api.slack.com/slash-commands:

- POST requests
- Content-type header set as `application/x-www-form-urlencoded`

Examples with [HTTPie](https://httpie.org/):

```
$ http --form POST localhost:4567/ 
HTTP/1.1 401 Unauthorized
Connection: Keep-Alive
Content-Length: 24
Content-Type: application/json
Date: Fri, 13 Apr 2018 19:27:33 GMT
Server: WEBrick/1.3.1 (Ruby/2.4.1/2017-03-22)
X-Content-Type-Options: nosniff

{
    "error": "Unauthorized"
}
```

```
$ http --form POST localhost:4567/ token=yFbsHnLCEHuYnfkTp8a9wTWf
HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Length: 65
Content-Type: application/json
Date: Fri, 13 Apr 2018 19:27:14 GMT
Server: WEBrick/1.3.1 (Ruby/2.4.1/2017-03-22)
X-Content-Type-Options: nosniff

{
    "response_type": "in_channel", 
    "text": "Hi ! You asked me to do  "
}
```

```
$ http --form POST localhost:4567/ token=yFbsHnLCEHuYnfkTp8a9wTWf \
    team_id=T0001 \
    team_domain=example \
    enterprise_id=E0001 \
    enterprise_name=Globular%20Construct%20Inc \
    channel_id=C2147483705 \
    channel_name=test \
    user_id=U2147483697 \
    user_name=Steve \
    command=/weather \
    text=94070 \
    response_url=https://hooks.slack.com/commands/1234/5678 \
    trigger_id=13345224609.738474920.8088930838d88f008e0
HTTP/1.1 200 OK
Connection: Keep-Alive
Content-Length: 89
Content-Type: application/json
Date: Fri, 13 Apr 2018 19:31:15 GMT
Server: WEBrick/1.3.1 (Ruby/2.4.1/2017-03-22)
X-Content-Type-Options: nosniff

{
    "response_type": "in_channel", 
    "text": "Hi U2147483697! You asked me to do /weather 94070"
}
```