var express = require('express')
var router = express.Router()
var azure = require('../azure-config-util')
var linq = require('linq')

router.post('/', function (req, res) {
  if (req.body.text.startsWith('init')) {
    handleInitCommand().then(data => {
      sendResponse(res, data)
    })
  } else if (req.body.text.startsWith('show')) {
    handleShowCommand().then(data => {
      sendResponse(res, data)
    })
  } else if (req.body.text.startsWith('add')) {
    handleAddCommand(req.body.text).then(data => {
      sendResponse(res, data)
    })
  } else {
    sendResponse(res, req.body)
  }
})

function sendResponse (res, data) {
  var message = {
    response_type: 'in_channel', // public to the channel
    text: data
  }
  res.json(message)
}

function handleInitCommand () {
  return azure.list().then(response => {
    if (response.data.entries.length > 0 && response.data.entries[0].name === 'teams') {
      return 'Team already exists.'
    } else {
      console.log('Team does not exist, creating it now.')
      return azure.uploadDefault()
    }
  }).catch(reason => {
    return reason
  }).then(response => {
    return response
  })
}

function handleShowCommand () {
  return azure.download().then(response => {
    return response
  }).catch(reason => {
    return reason
  })
}

// add @userid team
function handleAddCommand (commandText) {
  return azure.download().then(response => {
    var cmdParts = commandText.split(' ')
    var userid = cmdParts[1]
    var teamname = cmdParts[2]
    var json = JSON.parse(response)
    linq.from(json.teams).forEach(function (team) {
      if (team.name === teamname) {
        var exists = linq.from(team.members).any(function (member) { return member.userid === userid })
        if (!exists) {
          console.log('Adding UserId: ' + userid + ' to Team: ' + teamname)
          team.members.push({username: userid, userid: userid})
        } else {
          console.log('UserId: ' + userid + ' already exists on Team: ' + teamname)
        }
      }
    })
    return azure.upload(JSON.stringify(json, null, 2))
  }).catch(reason => {
    return reason
  }).then(response => {
    return response
  })
}

module.exports = router
