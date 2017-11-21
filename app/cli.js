#!/usr/bin/env node

const path = require('path')
const cp = require('child_process')
const fs = require('fs')
const readline = require('readline')
const fsReverse = require('fs-reverse')

const { getCurrentUser, setCurrentUser } = require('./dot-config')
const { ProsePlugin, deserializeLogEntry } = require('../dist/substance-dot.cjs.js')

/*
  DOT Command Line Interface: (WIP)

  dot init <path-to-folder>

    creates a .dot folder for `dot` internal data

  dot config [--global] key value

    sets a config value

  dot edit

    starts a local service which exposes an editor for the document

  dot log

    shows the master log

  dot status

    shows pending changes
*/
const argv = require('yargs')
  .usage('$0 <cmd> [args]')
  .command('init [folder]', 'Start versioning and collaborating on a texture folder.', init)
  .command('edit [folder]', 'Open Texture editor.', init)
  .command('log', 'Display the shared history', log)
  .command('status', 'Display pending changes (PR)', status)
  .help()
  .argv

function init(yargs) {
  /*
    Take the given folder as a seed for generating initial changes.
    There should be one 'xml' file and one folder with assets.
    We want to retain the initial xml file as version 'orig',
    and start with the transformed xml file as version 0 (after import).

    Structure of 'dot' repo:
    ```
    .dot/
      config.json
      document /
        orig
        initial
        CHANGELOG
        <user1>.PR
        <user2>.PR
      assets /
        CHANGELOG
        <user1>.PR
        <user2>.PR
      entities /
        CHANGELOG
        <user1>.PR
        <user2>.PR
    ```
  */
  const argv = yargs.argv
  const cwd = process.cwd()
  let folder = argv._.length > 1 ? argv._[1] || '.'
  folder = path.join(cwd, folder)
  const dotFolder = path.join(folder, '.dot')
  const documentFile = path.join(folder, 'document.xml')
  // stop if '.dot' folder is already there
  if (fs.existsSync(dotFolder)) {
    console.error("Folder has already been initialized")
    return
  }
  // check precondition: there must at least be a 'document.xml' file
  // TODO: we could be more flexible here, and try to identify
  // XML files, then we could have arbitrary naming,
  // and even multiple files (needed for Stencila)
  if (!fs.existsSync(documentFile)) {
    console.error("JATS file required 'document.xml'")
    return
  }
  try {
    // prepare the initial folder layout
    // TODO: it would be great if we could somehow create a 'recipe'
    // that could be configured... or maybe this is part of a 'dot'
    // plugin for texture?
    fs.mkDirSync(dotFolder)
    fs.mkDirSync(path.join(dotFolder, 'document'))
    fs.mkDirSync(path.join(dotFolder, 'assets'))
    fs.mkDirSync(path.join(dotFolder, 'entities'))
    // store the original JATS file
    fs.copySync(documentFile, path.join(dotFolder, 'document', 'orig'))
    // import the document
    // check if the document can be imported without errors
  } catch (error) {
    console.error(error)
    fse.removeSync('.dot')
  }
}

function edit(yargs) {
  const argv = yargs.argv
  const electron = require('electron')
  let editorPackage = require.resolve('../dist/editor/package.json')
  let editorDir = path.dirname(editorPackage)

  let cwd = process.cwd()
  let documentFolder = '.'
  if (argv._.length > 1) {
    documentFolder = argv._[1]
  }
  documentFolder = path.join(cwd, documentFolder)

  let child = cp.spawn(electron, [editorDir, documentFolder], {stdio: 'inherit'})
  child.on('close', function (code) {
    process.exit(code)
  })
}

function log() {
  console.log('TODO: show the version history')
}

function status() {
  console.log('TODO: show unsubmitted or pending changes')
}
