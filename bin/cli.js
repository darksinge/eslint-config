#!/usr/bin/env node
const fs = require('node:fs')
const path = require('node:path')
const { execSync } = require('node:child_process')
const readline = require('node:readline')
const { Command } = require('commander')
const packageJson = require(path.resolve(process.cwd(), 'package.json'))
const { name: thisPackageName } = require(path.join(
  __dirname,
  '..',
  'package.json',
))

const program = new Command()
program.requiredOption('--init', 'setup the config', false).parse(process.argv)
const options = program.opts()

const eslintrcPaths = {
  source: path.join(__dirname, '..', '.eslintrc-config.js'),
  dest: path.resolve(process.cwd(), '.eslintrc.js'),
}

const eslintConfig = fs.readFileSync(eslintrcPaths.source)

const writeConfig = () => {
  fs.writeFileSync(eslintrcPaths.dest, eslintConfig)
}

const shouldWriteConfig = () => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise((resolve) => {
    if (fs.existsSync(eslintrcPaths.dest)) {
      rl.question(
        '.eslintrc.js already exists. Overwrite? [N/y] ',
        (answer) => {
          rl.close()
          if (/ye?s?/i.test(answer)) {
            return resolve(true)
          }
          return resolve(false)
        },
      )
    } else {
      return resolve(true)
    }
  })
}

const main = async () => {
  if (!options.init) {
    return
  }

  // don't install this package within itself
  if (packageJson.name !== thisPackageName) {
    const { dependencies = {}, devDependencies = {} } = packageJson
    if (!dependencies[thisPackageName] || !devDependencies[thisPackageName]) {
      execSync('npm install @darksinge/eslint-config --save-dev')
    }
  }

  const shouldWrite = await shouldWriteConfig()
  if (shouldWrite) {
    writeConfig()
  }
}

main()
  .catch(console.error)
  .finally(() => process.exit(0))
