const env = process.env

const support = level => {
  if (level === 0) {
    return false
  }

  return {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3,
  }
}

let supportLevel = (() => {
  // if (hasFlag('no-color') || hasFlag('no-colors') || hasFlag('color=false')) {
  //   return 0
  // }
  //
  // if (
  //   hasFlag('color=16m') ||
  //   hasFlag('color=full') ||
  //   hasFlag('color=truecolor')
  // ) {
  //   return 3
  // }
  //
  // if (hasFlag('color=256')) {
  //   return 2
  // }
  //
  // if (
  //   hasFlag('color') ||
  //   hasFlag('colors') ||
  //   hasFlag('color=true') ||
  //   hasFlag('color=always')
  // ) {
  //   return 1
  // }

  if (process.stdout && !process.stdout.isTTY) {
    return 0
  }

  if (process.platform === 'win32') {
    return 1
  }

  if ('CI' in env) {
    if ('TRAVIS' in env || env.CI === 'Travis') {
      return 1
    }

    return 0
  }

  if ('TEAMCITY_VERSION' in env) {
    return (/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/).test(env.TEAMCITY_VERSION) ? 1 : 0
  }

  if ('TERM_PROGRAM' in env) {
    const version = parseInt((env.TERM_PROGRAM_VERSION || '').split('.')[0], 10)

    switch (env.TERM_PROGRAM) {
      case 'iTerm.app':
        return version >= 3 ? 3 : 2
      case 'Hyper':
        return 3
      case 'Apple_Terminal':
        return 2
      // no default
    }
  }

  if (/^(screen|xterm)-256(?:color)?/.test(env.TERM)) {
    return 2
  }

  if (/^screen|^xterm|^vt100|color|ansi|cygwin|linux/i.test(env.TERM)) {
    return 1
  }

  if ('COLORTERM' in env) {
    return 1
  }

  if (env.TERM === 'dumb') {
    return 0
  }

  return 0
})()

// if ('FORCE_COLOR' in env) {
//   supportLevel = parseInt(env.FORCE_COLOR, 10) === 0 ? 0 : supportLevel || 1
// }
module.exports = process && support(supportLevel)
