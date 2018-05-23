var express = require('express')
var router = express.Router()
var azure = require('../azure-config-util')

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
      return azure.upload()
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

function handleAddCommand (commandText) {
  return azure.download().then(response => {
    // var cmdParts = commandText.split(' ')
    var teams = JSON.parse(response)
    return teams
  }).catch(reason => {
    return reason
  })
}

module.exports = router
