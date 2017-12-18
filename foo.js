const path = require('path')
const fse = require('fs-extra')
const FsArchive = require('./archive/FsArchive')

fse.remove('bar/.changes')
  .then(() => {
    return fse.remove('bar/.git')
  })
  .then(() => {
    let archive = new FsArchive(path.join(__dirname, 'bar'))
    archive.init()
  })