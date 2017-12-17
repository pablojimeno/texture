import Archive from './archive/Archive.js'

const remote = require('electron').remote
const args = remote.getGlobal('sharedObject').args
const commandLineArgs = require('command-line-args')
const path = require('path')

const argv = args.slice(2)
const optionDefinitions = [
  { name: 'file', alias: 'f', type: String },
  { name: 'dir', alias: 'd', type: String },
]
const options = commandLineArgs(optionDefinitions, { argv })

/*
TODO: Archive Iteration 1

- Instead of working on a single file, allow to work on an archive folder.

*/

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
  options.rootDir = path.dirname(f)
  options.file = path.basename(f)
} else if (options.dir) {
  options.mode = 'dir'
}

window.onload = function() {

  const { platform, substanceGlobals } = window.substance
  substanceGlobals.DEBUG_RENDERING = Boolean(platform.devtools)

  const { Texture } = window.texture

  let archive = new Archive(options)

  window.app = Texture.mount({
    documentId: options.file,
    /*
      Implement your own logic to read and write XML
    */
    readXML: function(documentId, cb) {
      archive.readFileAsString(documentId)
        .then((content) => {
          cb(null, content)
        })
        .catch((err) => {
          cb(err)
        })
    },
    writeXML: function(documentId, xml, cb) {
      console.log('writeXML needs to be implemented for saving.')
      console.log('XML', xml)
      cb(null)
    }
  }, document.body)

}
