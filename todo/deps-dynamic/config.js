// this all takes only ~10 microseconds

const pth = require('path')
const rootp = require('app-root-path').path // eslint-disable-line

let pkgPath = pth.resolve(rootp, './package.json')
let pkg = {}
try {
  pkg = require(pkgPath) || {} // eslint-disable-line
}
catch (e) {
  // suckage
}

const tagged = require('./tagged')

const presets = {
  min: {
    middleware: ['data', 'text'],
    extends: [],
    plugins: [
      'chalk',
      'filter',
      'verbose',
      'flags',
      'quick',
      'returnVals',
      // can be disabled, maybe into `optional?`
      'presets',
    ],
  },

  fun: {
    middleware: [],
    extends: ['min'],
    plugins: [
      'sparkly',
      // (g)ui - extends cli
      'diff',
      'beep',
      'list',
    ],
  },

  formatting: {
    middleware: [],
    extends: ['min'],
    plugins: [
      'bar',
      'formatter',
      'json',
      'time',
      'stringify',
      'highlight',
      'xterm',
      'clear',
    ],
  },

  debugging: {
    middleware: [],
    extends: ['min', 'formatting'],
    plugins: [
      'capture',
      'register',
      'sleep',
      'track',
      'timer',

      // saving
      'file',
    ],
  },

  cli: {
    middleware: [],
    extends: ['min', 'debugging', 'formatting'],
    plugins: [
      'box',
      'notify',
      'progress',
      'table',
      'spinners',
    ],
  },

  latest: {
    middleware: [],
    extends: ['min', 'cli', 'debugging', 'formatting', 'fun'],
    plugins: [
      // todo
      // 'list',
      // 'story',
    ],
  },

  default: {
    middleware: [],
    extends: ['min', 'cli', 'debugging', 'formatting'],
    plugins: [
      // todo
      // 'list',
      // 'story',
    ],
  },
}

// paths to require and use
let exportee = []
let exporte = {exportee, pkg}
let paths = []

// if we've already run it
if (exportee.length === 0) {
  function resolve(ex) {
    const mware = presets[ex].middleware
    const plugins = presets[ex].plugins

    for (let m = 0; m < mware.length; m++) {
      // uniq
      const path = './middleware/' + mware[m]
      if (paths.includes(path)) continue

      // resolve to path, require
      exportee.push(require(path)) // eslint-disable-line
      paths.push(path)
    }
    for (let p = 0; p < plugins.length; p++) {
      // uniq
      const path = './plugins/' + plugins[p]
      if (paths.includes(path)) continue

      // resolve to path, require
      exportee.push(require(path)) // eslint-disable-line
      paths.push(path)
    }
  }

  function remap(use) {
    const xtends = presets[use].extends

    for (let i = 0; i < xtends.length; i++) {
      resolve(xtends[i])
    }

    resolve(use)
  }

  // always use .min
  remap('min')

  // remap('latest')
  // module.exports = exportee

  if (pkg.fliplog) {
    let config = pkg.fliplog
    let debug = false
    if (config !== undefined && config.debug !== undefined) {
      debug = true
    }
    if (Array.isArray(config) === false) {
      config = config.use
    }

    for (let c = 0; c < config.length; c++) {
      const use = config[c]
      if (use === 'min') continue
      if (presets[use] !== null && presets[use] !== undefined) {
        if (pkg.fliplog.debug === true) {
          console.log('using ', use)
        }

        remap(use)
      }
      else {
        console.log('used an unknown fliplog config: ', {use})
      }
    }
  }
  else if (tagged === false) {
    if (process.argv.includes('--fliplog') === true) {
      console.log('has no tag and no pkg config, using "latest"')
    }

    remap('latest')
  }
  else {
    if (pkg.fliplog !== undefined && pkg.fliplog.debug === true) {
      console.log('has no package config, but has tag: ', tagged)
    }

    remap(tagged)
  }
}

module.exports = exporte
