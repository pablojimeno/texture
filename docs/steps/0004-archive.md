# Introduction

Texture allows to load and write to an archive, containing
a JATS file, assets.

The considered use-case:
1. Read a JATS file from a folder with a specific layout
2. Import the JATS file initializing the archive.
3. Edit the document iteratively and persist on disk.
4. Create versions where the user can enter a 'commit' message.

The goal is to move towards a workable Texture version that allows development cycles on topics such as import, export, and versioning.

# Iteration 1

- Create a demo which uses 3 Sessions for the document, assets, and entities.
- Record changes and combine them into one stream (~pull request)
- Persist the stream of changes on the fly (~buffer)
- When reopened the document should be loaded from the buffer
  - Invariant: archive = snapshot + changes
  - If the working copy is empty, it is initialized using a template

# Iteration 2

- Allow to write the buffer to disk
- Allow to enter a commit message.
- Show version history

> Idea: use git for the history of versions. Then incremental updates and versioning on snapshot level is for free

> TODO: study how to use git in nodejs