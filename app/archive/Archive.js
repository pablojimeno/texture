const fs = require('fs')
const path = require('path')

export default class Archive {

  constructor(opts) {
    if (!opts.rootDir) {
      throw new Error("'rootDir' is required")
    }
    this.rootDir = opts.rootDir
    this.opts = opts
  }

  readFileAsString(relPath) {
    let absPath = path.join(this.rootDir, relPath)
    relPath = path.relative(this.rootDir, absPath)
    if (/^\.\./.exec(relPath)) {
      return Promise.reject('Access denied')
    }
    return new Promise((resolve, reject) => {
      fs.readFile(absPath, 'utf8', (err, content) => {
        if (err) reject(err)
        else resolve(content)
      })
    })
  }

}
