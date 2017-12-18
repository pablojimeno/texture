const remote = require('electron').remote
const args = remote.getGlobal('sharedObject').args
const commandLineArgs = require('command-line-args')
const path = require('path')

const ArchiveSession = require('../../archive/ArchiveSession')
const FsArchive = require('../../archive/FsArchive')

const argv = args.slice(2)
const optionDefinitions = [
  { name: 'init', alias: 'i', type: Boolean },
  { name: 'file', alias: 'f', type: String },
  { name: 'dir', alias: 'd', type: String },
]
const options = commandLineArgs(optionDefinitions, { argv })

// if no args are given load the intro
if (argv.length === 0) {
  options.file = 'data/introducing-texture.xml'
}

if (options.file) {
  let f = options.file
  if (!path.isAbsolute(f)) {
    f = path.join(process.cwd(), f)
  }
  options.mode = 'file'
  options.dir = path.dirname(f)
  options.file = path.basename(f)
} else if (options.dir) {
  options.mode = 'dir'
}

window.onload = function() {
  const { platform, substanceGlobals } = window.substance
  const { Texture } = window.texture

  platform._reset()
  substanceGlobals.DEBUG_RENDERING = Boolean(platform.devtools)
  console.log('DEBUG_RENDERING?', substanceGlobals.DEBUG_RENDERING)

  let p = Promise.resolve()
  let archive = new FsArchive(options.dir)
  let session
  if (options.init) {
    p = archive.init()
  } else {
    p = archive.load()
  }
  p.then(() => {
    return ArchiveSession.create(archive)
  }).then((_session) => {
    session = _session
    // window.app = Texture.mount({
    //   session
    // }, document.body)
  })
}
