export default class TextureContext {

  // WIP: sketching a potential interface
  // ATM the texture context provides access to one single
  // texture archive (~Reproducible Document Container)

  /*
    Provides JATS file as XML.

    @param { string } docId (optional) the document
    @return Promise for an XML string
  */
  getDocumentXML(docId) {}

  getEntities({ dbId }) {}

  getUrl({ assetId })

  // VERSIONING

  /*
    Creates a new version.

    @param {object} options
    @param {string} options.message
    @return a Promise for a SHA
  */
  createVersion({ message }) {}

  /*
    Checkout an older version.

    Note: this is like `git reset --hard sha`

    @param {object} options
    @param {string} options.message
    @return a Promise that resolves when the version has been checked out.
  */
  checkoutVersion({ sha }) {}

  // BUFFER
  // Note: the buffer is a sequence of archive changes
  // which is persisted as often as possible.
  // The buffer can be seen as a stage for creating commits or PR.

  push({ changes }) {}

}