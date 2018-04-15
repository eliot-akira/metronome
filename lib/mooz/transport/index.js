const getAudioContext = require('../context')
const WebAudioScheduler = require('./WebAudioScheduler')
const workerTimer = require('./workerTimer')

const createTransport = (props = {}) => {

  const transport = new WebAudioScheduler({
    context: props.audioContext || getAudioContext(),
    timerAPI: props.timerAPI || workerTimer
  })

  // Browser background tab

  // TODO: Provide method on scheduler for changing aheadTime to avoid
  // mutating it during process()

  /*
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      transport.aheadTime = 0.1
    } else {
      transport.aheadTime = 1.0
      transport.process()
    }
  })*/

  return transport
}

module.exports = createTransport