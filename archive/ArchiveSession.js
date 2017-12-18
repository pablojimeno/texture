class ArchiveSession {

  constructor(archive) {
    this.archive = archive

    this.sessions = []
  }

  _initialize() {
    return this.archive.getDocument('manifest.xml')
      .then((xml) => {
        console.log('MANIFEST XML', xml)
      })
  }
}

ArchiveSession.create = function(archive) {
  return new ArchiveSession(archive)._initialize()
    .then(() => { return this })
}

module.exports = ArchiveSession
