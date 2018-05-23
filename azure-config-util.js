var storage = require('azure-storage')
var path = require('path')

var blobService = storage.createBlobService()
var containerName = 'gregg-container'
var sourceFilePath = path.resolve('config/teams.json')
var blobName = path.basename(sourceFilePath, path.extname(sourceFilePath))

exports.createContainer = function () {
  return new Promise((resolve, reject) => {
    blobService.createContainerIfNotExists(containerName, { publicAccessLevel: 'blob' }, err => {
      if (err) {
        reject(err)
      } else {
        resolve({ message: `Container '${containerName}' created` })
      }
    })
  })
}

exports.upload = function () {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromLocalFile(containerName, blobName, sourceFilePath, err => {
      if (err) {
        reject(err)
      } else {
        resolve({ message: `Upload of '${blobName}' complete` })
      }
    })
  })
}

exports.download = function () {
  return new Promise((resolve, reject) => {
    blobService.getBlobToText(containerName, blobName, (err, blob) => {
      if (err) {
        reject(err)
      } else {
        resolve(blob)
      }
    })
  })
}

exports.list = function () {
  return new Promise((resolve, reject) => {
    blobService.listBlobsSegmented(containerName, null, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve({ message: `Items in container '${containerName}':`, data: data })
      }
    })
  })
}
