const log = require('../')

const eh = {
  eh: true,
}
const two = {
  added: true,
  eh: false,
}
log.diff(eh, two).echo()
log.diff('eh', 'ehoh').echo()
