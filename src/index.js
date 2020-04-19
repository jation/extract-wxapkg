#! /usr/bin/env node 
const fs = require('fs')
const path = require('path')
const glob = require('glob')
const mkdirp = require('mkdirp')
const extractWxapkg = require('./extract')
const program = require('commander')

program
.option('-sd, --source-dir [string]', 'source directory')
.option('-td, --target-dir [string]', 'target directory')
.parse(process.argv)

if (program.sourceDir && program.targetDir) {
  extractPkgInDir(program.sourceDir, program.targetDir)
}

function extractPkgInDir(sd, td) {
  let sourceDir = sd
  let targetDir = td
  if(!path.isAbsolute(sourceDir)) {
    sourceDir = path.resolve(process.cwd(), sourceDir)
  }
  if(!path.isAbsolute(targetDir)) {
    targetDir = path.resolve(process.cwd(), targetDir)
  }
  
  
  glob(path.join(sourceDir, '**/*'), {}, function (error, files) {
    if (error) {
      console.error('🥵 - glob files error', error)
      return
    }
    if (files.length) {
      if(!fs.existsSync(targetDir)) {
        mkdirp.sync(targetDir)
      }
    } else {
      console.warn(`${targetDir} is EMPTY`)
    }
    files.filter(file => {
      return fs.lstatSync(file).isFile()
    }).forEach( filePath => {
      console.info(`📚 - reading: ${filePath}`)
      fs.readFile(filePath, (fileReadError, fileBuffer) => {
        if (fileReadError) {
          console.error('🥵 - read file error, file path: ', filePath)
          return
        }
        extractWxapkg(path.basename(filePath), fileBuffer, targetDir, { verbose: true })  
      })
    })
  })
}
