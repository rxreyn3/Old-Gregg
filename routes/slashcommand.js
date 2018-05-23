var express = require('express')
var router = express.Router()
var azure = require('../azure-config-util')

router.post('/', function (req, res) {
  if (req.body.text === 'init') {
    azure.list().then(response => {
      if (response.data.entries.length > 0 && response.data.entries[0].name === 'teams') {
        res.send('Team already exists.')
      } else {
        res.send('Team does not exist, creating it now.')
        azure.upload()
      }
    }).catch(reason => {
      res.send(reason)
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

module.exports = router
