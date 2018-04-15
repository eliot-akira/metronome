const createMaster = require('../master')

function createMetronome() {

  const master = createMaster()

  const { audioContext } = master

  master.createMasterOutput()

  const output = master.output

  master.on('beat', ({ beat }) => {
    //console.log(`beat ${beat}`)
  })

  master.on('scheduleBeat', e => {

    const { playbackTime, beat } = e

    // Schedule sound

    const t0 = playbackTime
    const t1 = t0 + .1

    const step = beat % 4

    // TODO: Accent every 4 for some meters
    const freq = step===1 ? 880 : 440
    // step===4 ? 698.456

    const osc = audioContext.createOscillator()
    const amp = audioContext.createGain()

    osc.frequency.value = freq

    osc.start(t0)
    osc.stop(t1)
    osc.connect(amp)

    const volume = master.getState('volume')==0 ? 0 : 0.8

    //amp.gain.setValueAtTime(0.8, t0)
    amp.gain.setTargetAtTime(volume, t0, .01)
    amp.gain.exponentialRampToValueAtTime(1e-6, t1)
    amp.connect(output)

    master.next(t1, () => {
      osc.disconnect()
      amp.disconnect()
    })
  })

  return master
}

createMetronome.createState = createMaster.createState

module.exports = createMetronome