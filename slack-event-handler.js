var { WebClient } = require('@slack/client')

var token = process.env.SLACK_TOKEN
var web = new WebClient(token)

var createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter
var slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN)

exports.getEventHandler = function () {
  return slackEvents.expressMiddleware()
}

slackEvents.on('message', (event) => {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`)
  if (event.user === undefined) {
    console.log('Ignoring event: ' + event)
  } else {
    web.chat.postMessage({
      channel: event.channel,
      text: 'Hello my little man peach.'
    }).then((res) => {
      // `res` contains information about the posted message
      console.log('Message sent: ', res.ts)
    }).catch(console.error)
  }
})

slackEvents.on('error', console.error)
