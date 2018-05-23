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
        resolve(`Container '${containerName}' created`)
      }
    })
  })
}

exports.uploadDefault = function () {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromLocalFile(containerName, blobName, sourceFilePath, err => {
      if (err) {
        reject(err)
      } else {
        resolve(`Upload of '${blobName}' complete`)
      }
    })
  })
}

exports.upload = function (blob) {
  return new Promise((resolve, reject) => {
    blobService.createBlockBlobFromText(containerName, blobName, blob, err => {
      if (err) {
        reject(err)
      } else {
        resolve(`Upload of '${blobName}' complete`)
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
        resolve(`Items in container '${containerName}'`)
      }
    })
  })
}
