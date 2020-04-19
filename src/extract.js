const fs = require('fs')
const path = require('path')
const mkdirp = require('mkdirp')
const wxapkg = require('@tencent/wxapkg')
/**
 * @param wxvpkgFileBuffer file Buffer
 * @param targetDir should be a 
 */
module.exports = function extract(packageName, wxvpkgFileBuffer, targetDir, options) {
  const {
    verbose = false,
  } = options
  return new Promise((resolve, reject) => {
    if(!wxvpkgFileBuffer || !targetDir) {
      reject('wxvpkgFileBuffer or targetDir required')
    }
    if (!path.isAbsolute(targetDir)) {
      reject('targetDir should be a absolute path')
    }
    if (!fs.existsSync(targetDir)) {

    }
    wxapkg.unpack(wxvpkgFileBuffer).then((files => {
      let extractedCount = 0
      const fileCount = files.length
      const packageTargetDir = path.join(targetDir, packageName)
      if (!fs.existsSync(packageTargetDir)) {
        mkdirp.sync(packageTargetDir)
      }
      console.info('packageTargetDir', packageTargetDir)
      files.forEach((file, index) => {
        const originFilePath = file.path
        fs.writeFile(path.join(packageTargetDir, path.basename(originFilePath)), file.data, () => {
          verbose && console.info(`🧩 - ${packageName} (${extractedCount + 1} / ${fileCount}) extracted: ${originFilePath}`)
          extractedCount++
          if (extractedCount === files.length ) {
            verbose && console.info(`🧩 - ${packageName} Extracted to ${packageTargetDir}`)
            verbose && console.info(`🧩 - ${packageName} ${files.length} file extracted successfully!`)
            resolve(`${files.length} file extracted successfully!`)
          }
        })
      })
    })).catch(error => {
      console.error('🥵 - wxgpkg.unpack Error', error)
      reject('extract error')
    })
  })
  
}