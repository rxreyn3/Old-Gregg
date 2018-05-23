var express = require('express')
var router = express.Router()
var azure = require('../azure-config-util')

router.post('/', function (req, res) {
  if (req.body.text === 'init') {
    handleInitCommand().then(response => {
      res.send(response)
    })
  } else {
    res.json(req.body)
  }
  /*   var data = {
    response_type: 'in_channel', // public to the channel
    text: '302: Found',
    attachments: [ {
      image_url: 'https://http.cat/302.jpg'
    } ]}
  res.json(data) */
})

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

module.exports = router
