const fs = require('fs')
const path = require('path')
const fse = require('fs-extra')
const glob = require('glob')
const { Repository, Signature } = require('nodegit')

// TODO: how to get the global git user?
const COMMITTER = Signature.create("Ann Smith", "ann@smith.foo", 123456789, 60)

module.exports = class FSArchive {

  constructor(rootDir) {
    this.rootDir = rootDir
    this.repo = null
  }

  create() {
    return fse.remove(this.rootDir)
      .then(() => {
        return this._initEmpty()
      })
  }

  init(options = {}) {
    let hasGit = fs.existsSync(path.join(this.rootDir, '.git'))
    let hasChanges = fs.existsSync(path.join(this.rootDir, '.changes'))

    if (!hasGit) {
      this._createGitRepo()
        .then((oid) => {
          return this._createChangesFile(oid.tostrS())
        })
    } else {
      this._getMasterCommit()
        .then((oid) => {
          return this._createChangesFile(oid.tostrS())
        })
    }
  }

  // called on an empty dir
  // TODO: or an existing folder maybe even; someday even an existing .git
  _initEmpty() {
    return fse.ensureDir(this.rootDir)
      // copy template files
      .then(() => {
        return glob.sync(this._templateDir()+'/**/*', {nodir: true})
      })
      .then((files) => {
        return Promise.all(files.map((absPath) => {
          let relPath = path.relative(this._templateDir(), absPath)
          let dest = path.join(this.rootDir, relPath)
          let destDir = path.dirname(dest)
          return fse.ensureDir(destDir).then(() => {
            return fse.copy(absPath, dest)
          })
        }))
      })
      // create a git repo
      .then(() => {
        return this._createGitRepo()
      })
      .then((oid) => {
        let sha = oid.tostrS()
        return this._createChangesFile(sha)
      }).catch((err) => {
        console.error(err)
      })
  }

  _createGitRepo() {
    return Repository.init(this.rootDir, 0)
      .then((repo) => {
        this.repo = repo
        return this.repo.refreshIndex();
      })
      then(() => {
        // adding all files except for .changes
        return glob.sync(this.rootDir+'/**/*', {nodir: true})
      })
      .then((_files) => {
        let files = []
        _files.forEacj((absPath) => {
          let relPath = path.relative(this.rootDir, absPath)
          if (relPath !== '.changes') {
            files.push(relPath)
          }
        })
        return this.repo.createCommitOnHead(files, COMMITTER, COMMITTER, "Initial commit.")
      })
  }

  _createChangesFile(sha) {
    let changes = JSON.stringify({ version: sha })
    return fse.outputFile(path.join(this.rootDir, '.changes'), changes)
  }

  _getMasterCommit() {

  }

  _getRepo() {
    if (this.repo) {
      return Promise.resolve(this.repo)
    } else {
     return Repository.open(this.rootDir)
      .then((repo) => {
        this.repo = repo
        return repo
      })
    }
  }

  load() {
    if (!fs.existsSync(path.join(this.rootDir, '.git'))) {
      throw new Error('There is no .git folder.')

    if (!fs.existsSync(path.join(this.rootDir, '.changes'))) {
      throw new Error('There is no  project has already been initialized.')
    }
  }

  getDocument(docId) {
    return new Promise((resolve, reject) => {
      let f = path.join(this.rootDir, docId)
      fs.readFile(f, 'utf8', (err, data) => {
        if (err) reject(err)
        else resolve(data)
      })
    })
  }

  _templateDir() {
    return path.join(__dirname, 'template')
  }
}