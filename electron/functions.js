const fs = require('fs')
const path = require('path')
const jsmediatags = require('jsmediatags')
const cacheDir = path.resolve(__dirname, '../.cache/albums/')

module.exports = {

  readAudioTags (path) {
    return new Promise((resolve, reject) => {
      new jsmediatags.Reader(path)
      .setTagsToRead(['title', 'artist', 'album', 'picture'])
      .read({
        onSuccess: (tag) => {
          this.cacheAlbumCover(tag.tags.album, tag.tags.picture, (cover, error) => {
            let tags = tag.tags
            tags.cover = error ? null : cover
            resolve(tags)
          })
        },
        onError: (error) => {
          reject(error)
        }
      })
    })
  },

  cacheAlbumCover (album, picture, callback) {

    //console.log(album, picture)
    let cacheFilePath = path.resolve(cacheDir, album + '.' + picture.format.split('/')[1])
    // create cache file if not exists
    if (!fs.existsSync(cacheFilePath)) {
      // encode picture data with base64
      let fileContent = this.base64encodePicture(picture)
      // write file
      if (fileContent) {
        fs.writeFile(cacheFilePath, fileContent, 'binary', (error) => {
          callback(cacheFilePath, error)
        })
      } else {
        callback(null, true)
      }
    } else {
      callback(cacheFilePath)
    }

  },

  base64encodePicture(picture) {

    if (!picture) {
      return null
    } else {
      return picture.data.map((item) => String.fromCharCode(item)).join('')
    }

  }

}