var express = require('express')
var router = express.Router()
var azure = require('../azure-config-util')
var linq = require('linq')
var { WebClient } = require('@slack/client')

var token = process.env.SLACK_TOKEN
var gregg = process.env.OLD_GREGG
var web = new WebClient(token)

router.get('/:team', function (req, res, next) {
  callStandupReports(req.params.team).then(response => {
    res.send('Standup Started')
  })
})

function callStandupReports (teamname) {
  return azure.download().then(response => {
    var json = JSON.parse(response)
    linq.from(json.teams).forEach(function (team) {
      if (team.name === teamname) {
        notifyTeamMembers(team)
      }
    })
  })
}

function notifyTeamMembers (team) {
  console.log('Starting standup for team: ' + team.name)
  linq.from(team.members).forEach(function (member) {
    web.chat.postMessage({
      as_user: false,
      username: 'Old Gregg',
      icon_url: gregg,
      channel: member.userid,
      text: 'Please start your standup report by typing:\r\n`/gregg report The details of your report here`'
    }).then((res) => {
      console.log('Message sent: ', res.ts)
    }).catch(console.error)
  })
}

module.exports = router
