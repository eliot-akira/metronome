const createStateManager = require('../../state')
const createAudioContext = require('../context')
const createTransport = require('../transport')
const { createState, actions } = require('./state')

let master

function createMaster(props = {}) {

  // Single instance per application
  if (master) return master

  // Event methods: on, once, off, emit
  // State methods: getState, setState, action
  master = createStateManager({
    createState,
    actions
  })
  master.setActionContext({ master })

  const audioContext = props.audioContext || createAudioContext()
  const transport = createTransport({ audioContext })

  function getPosition(data) {

    let remain = data.beat - 1
    const measures = Math.floor(remain / 16) + 1
    remain -= (measures - 1)*16
    const bars = Math.floor(remain / 4) + 1
    remain -= (bars - 1) * 4
    const beats = remain+1

    return {
      bars, beats,
      totalBeats: data.beat
    }
  }

  // Main loop

  function loop({ playbackTime }) {

    const state = master.getState()
    const t0 = playbackTime
    const t1 = t0 + (60 / state.tempo) // Time to next beat in seconds

    transport.insert(t0, tick)
    transport.insert(t1, loop) // Loop

    // TODO: Schedules

  }

  // Transport calls this with scheduled event in advance
  function tick({
    playbackTime, // Time to event in seconds
    position,
    args
  }) {

    const state = master.getState()
    const nextBeat = state.beat+1 // Beat count at event time
    const eventData = {
      beat: nextBeat,
      playbackTime,
      position: getPosition({ beat: nextBeat })
    }

    // Let players know
    master.emit('scheduleBeat', eventData)

    // On next beat
    master.next(playbackTime, () => {
      master.setState({ beat: nextBeat }, { silent: true })
      master.emit('beat', eventData)
    })
  }

  const transportEvents = ['start', 'stop', 'pause', 'resume']

  transportEvents.forEach(key =>
    transport.on(key, (e) => master.emit(key, { position: getPosition(e) }))
  )

  Object.assign(master, {
    audioContext,
    transport,
    next: transport.nextTick.bind(transport),
    loop,
  })

  return master
}

// For getting initial state from outside
createMaster.createState = createState

module.exports = createMaster