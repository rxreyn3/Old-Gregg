var createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
var slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);

exports.getEventHandler = function () {
    return slackEvents.expressMiddleware();
}

slackEvents.on('message', (event)=> {
  console.log(`Received a message event: user ${event.user} in channel ${event.channel} says ${event.text}`);
});
slackEvents.on('error', console.error);