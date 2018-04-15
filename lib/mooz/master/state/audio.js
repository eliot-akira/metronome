// Audio nodes

let audioNodes = []

module.exports = {

  createMasterOutput({ state, actions, master }) {

    if (!master.output) {

      master.output = master.audioContext.createGain()
      master.output.connect(master.audioContext.destination)

      actions.setVolume({ volume: state.volume })

      audioNodes.push(master.output)
    }

    return master.output
  },

  createOutput({ actions, master }) {

    const masterOut = actions.createMasterOutput()
    const output = master.audioContext.createGain()

    output.connect(masterOut)
    audioNodes.push(output)

    return output
  },

  setVolume({ setState, master, volume }, arg) {
    volume = volume!==undefined ? volume : arg
    if (!volume < 0 || volume > 100) return
    if (master.output) master.output.gain.value = volume / 100
    setState({ volume })
  },

  dispose({ master }) {

    master.emit('dispose')

    audioNodes.forEach(node => {
      try {
        node.disconnect()
      } catch (e) {/**/}
    })

    audioNodes = []
    master.output = null
  }

}
