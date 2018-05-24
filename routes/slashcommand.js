var express = require('express')
var router = express.Router()
var azure = require('../azure-config-util')
var linq = require('linq')
var { WebClient } = require('@slack/client')

var token = process.env.SLACK_TOKEN
var web = new WebClient(token)

router.post('/', function (req, res) {
  console.log('Request Body',req.body)
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
  } else if (req.body.text.startsWith('report')) {
    handleReportCommand(req.body.user_name, req.body.text).then(data => {
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
    var sb = ''
    var json = JSON.parse(response)
    linq.from(json.teams).forEach(function (team) {
      linq.from(team.members).forEach(function (member) {
        sb += 'Team: `' + team.name +  '`Name: `' + member.username + '` ID: `' + member.userid + '`\r\n'
      })
    })
    return sb
  }).catch(reason => {
    return reason
  })
}

var errHandler = function(err) {
  console.log(err);
}

// add @userid team
function handleAddCommand (commandText) {
  var cmdParts = commandText.split(' ')
  var username = cmdParts[1]
  var teamname = cmdParts[2]

  return new Promise((resolve, reject) => {
    getUserListAndConfig(username).then(result => {
      var user = result.user
      var config = result.config
      linq.from(config.teams).forEach(function (team) {
        if (team.name === teamname) {
          var exists = linq.from(team.members).any(function (member) { return member.userid === user.id })
          if (!exists) {
            console.log('Adding: ' + user.name + ' UserId: ' + user.id + ' to Team: ' + teamname)
            team.members.push({username: user.name, userid: user.id})
            resolve(azure.upload(JSON.stringify(config, null, 2)))
          } else {
            console.log('UserId: ' + user.id + ' already exists on Team: ' + teamname)
            reject('User already exists on team.')
          }
        }
      })
    })
  }).catch(reason => {
    return reason
  }).then(config => {
    return config
  })
}

function getUserListAndConfig(username){
  var userPromise = getUserIdForName(username);
  var configPromise = azure.download();

  userPromise.then(function(result) {
    console.log('User Info: ',result)
  }, errHandler);

  configPromise.then(function(result) {
    console.log('Config: ',result)
  }, errHandler);

  return Promise.all([userPromise, configPromise]).then(function([userResult, configResult]){
    return { user: userResult, config: JSON.parse(configResult) }
  }).catch(errHandler)
}

function getUserIdForName (username) {
  username = username.replace('@','')
  return web.users.list().then((res) => {
    var user = linq.from(res.members).single(function (member) { return member.name === username})
    console.log('Discovered userid: ' + user.id + ' for user: ' + user.name)
    return user
  })
}

function handleReportCommand (username, commandText) {
  return new Promise((resolve, reject) => {
    console.log(username + ' : ' + commandText)
    var channel = findChannelForUser(username).then(team => {
      console.log('Found user in team: ' + team.name)
    })
  })
}

function findChannelForUser (username) {
  return azure.download().then(response => {
    var json = JSON.parse(response)
    linq.from(json.teams).forEach(function (team) {
      var exists = linq.from(team.members).any(function (member) { return member.userid === username })
      if(exists) return team
    })
    return null
  })
}

module.exports = router
