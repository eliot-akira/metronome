
const createState = () => ({
  volume: 60,
  tempo: 60, // beats per miute
  beat: 0, // beat count: 0 = stopped, 1 = start of first beat
  timeSignature: {
    numBeats: 4,
    beatUnit: 4
  },

  isPlaying: false,
  isPaused: false,
  isStopped: true,

  // TODO:
  countdown: false,
  pickupMeasure: false
})

const actions = {
  ...require('./audio'),
  ...require('./transport'),
  ...require('./load'),
}

module.exports = { createState, actions }